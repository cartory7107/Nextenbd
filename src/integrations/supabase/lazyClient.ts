import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export type TypedSupabaseClient = SupabaseClient<Database>;

let cached: TypedSupabaseClient | null = null;
let inFlight: Promise<TypedSupabaseClient> | null = null;

/**
 * Lazily imports the auto-generated supabase client.
 * This prevents hard-crashes (white screen) if env vars haven't been injected yet.
 */
export async function getSupabaseClient(): Promise<TypedSupabaseClient> {
  if (cached) return cached;
  if (inFlight) return inFlight;

  inFlight = import("./client")
    .then((m) => m.supabase as unknown as TypedSupabaseClient)
    .then((client) => {
      cached = client;
      return client;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function formatBackendInitError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  if (lower.includes("supabaseurl is required")) {
    return "Backend config is missing (SUPABASE_URL). Use 'Rebuild preview' (not just refresh) so environment variables load.";
  }

  if (lower.includes("supabasekey is required")) {
    return "Backend config is missing (SUPABASE_KEY). Use 'Rebuild preview' so environment variables load.";
  }

  return `Backend initialization failed: ${message}`;
}
