import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, CreditCard, Gift, Settings, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";

const AccountPage = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/");
  };

  const handleComingSoon = (label: string) => {
    toast({ title: label, description: "This feature is coming soon!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const wishlistCount = getWishlistCount();

  const menuItems = [
    { icon: Package, label: "My Orders", href: null, count: 0 },
    { icon: Heart, label: "Wishlist", href: "/wishlist", count: wishlistCount },
    { icon: MapPin, label: "Addresses", href: null, count: 0 },
    { icon: CreditCard, label: "Payment Methods", href: null, count: 0 },
    { icon: Gift, label: "My Coupons", href: null, count: 0 },
    { icon: Settings, label: "Settings", href: null, count: 0 },
  ];

  const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-[76px]">
        <div className="section-container py-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl p-8 mb-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="btn-glass px-6 py-3 rounded-xl flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Orders", value: "0", icon: Package },
              { label: "Wishlist Items", value: String(wishlistCount), icon: Heart },
              { label: "Saved Addresses", value: "0", icon: MapPin },
              { label: "Coupons", value: "0", icon: Gift },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Menu Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <div className="divide-y divide-border">
              {menuItems.map((item) =>
                item.href ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.count > 0 && (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleComingSoon(item.label)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {item.count > 0 && (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {item.count}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountPage;
