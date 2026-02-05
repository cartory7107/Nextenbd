import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { formatBackendInitError, getSupabaseClient } from "@/integrations/supabase/lazyClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  backendError: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const supabase = await getSupabaseClient();

        // Set up auth state listener FIRST
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (cancelled) return;
          setSession(nextSession);
          setUser(nextSession?.user ?? null);
          setLoading(false);
        });
        unsubscribe = () => subscription.unsubscribe();

        // THEN check for existing session
        const {
          data: { session: existingSession },
        } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.error("AuthProvider init failed:", err);
        if (cancelled) return;
        setBackendError(formatBackendInitError(err));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) {
        return { error: error as Error };
      }

      // Auto-login after successful signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: signInError as Error | null };
    } catch (err) {
      return { error: new Error(formatBackendInitError(err)) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error: error as Error | null };
    } catch (err) {
      return { error: new Error(formatBackendInitError(err)) };
    }
  };

  const signOut = async () => {
    try {
      const supabase = await getSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, backendError, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
