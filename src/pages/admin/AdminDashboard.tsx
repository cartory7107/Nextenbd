import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSupabaseClient } from "@/integrations/supabase/lazyClient";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    pendingVendors: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = await getSupabaseClient();
        // Fetch user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch vendor counts
        const { count: vendorCount } = await supabase
          .from('vendors')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', true);

        const { count: pendingCount } = await supabase
          .from('vendors')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', false);

        // Fetch admin count
        const { count: adminCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['super_admin', 'admin']);

        setStats({
          totalUsers: userCount || 0,
          totalVendors: vendorCount || 0,
          pendingVendors: pendingCount || 0,
          totalAdmins: adminCount || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Vendors",
      value: stats.totalVendors,
      icon: Store,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Pending Vendors",
      value: stats.pendingVendors,
      icon: Package,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Admins",
      value: stats.totalAdmins,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your admin dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">
                        {loading ? "..." : stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Users className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium">Manage Users</p>
              <p className="text-sm text-muted-foreground">Add admins, vendors & more</p>
            </a>
            <a
              href="/admin/vendors"
              className="p-4 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <Store className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium">Manage Vendors</p>
              <p className="text-sm text-muted-foreground">Approve & manage vendors</p>
            </a>
            <a
              href="/admin/roles"
              className="p-4 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium">Roles & Permissions</p>
              <p className="text-sm text-muted-foreground">Configure access controls</p>
            </a>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
