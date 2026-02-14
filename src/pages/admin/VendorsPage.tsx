import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Store, Check, X, MoreVertical, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getSupabaseClient } from "@/integrations/supabase/lazyClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";

interface Vendor {
  id: string;
  user_id: string;
  store_name: string;
  store_description: string | null;
  logo_url: string | null;
  is_approved: boolean;
  is_active: boolean;
  commission_rate: number;
  created_at: string;
  profile?: {
    display_name: string | null;
  };
}

const VendorsPage = () => {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchVendors = async () => {
    try {
      const supabase = await getSupabaseClient();
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles for each vendor
      const vendorsWithProfiles = await Promise.all(
        (data || []).map(async (vendor) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', vendor.user_id)
            .maybeSingle();
          return { ...vendor, profile };
        })
      );

      setVendors(vendorsWithProfiles);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vendors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const approveVendor = async (vendorId: string) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('vendors')
        .update({ is_approved: true })
        .eq('id', vendorId);

      if (error) throw error;

      // Also add vendor role to the user
      const vendor = vendors.find((v) => v.id === vendorId);
      if (vendor) {
        await supabase.from('user_roles').upsert({
          user_id: vendor.user_id,
          role: 'vendor',
        });
      }

      toast({
        title: "Success",
        description: "Vendor approved successfully",
      });

      fetchVendors();
    } catch (error) {
      console.error('Error approving vendor:', error);
      toast({
        title: "Error",
        description: "Failed to approve vendor",
        variant: "destructive",
      });
    }
  };

  const rejectVendor = async (vendorId: string) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vendor application rejected",
      });

      fetchVendors();
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      toast({
        title: "Error",
        description: "Failed to reject vendor",
        variant: "destructive",
      });
    }
  };

  const toggleVendorStatus = async (vendorId: string, isActive: boolean) => {
    try {
      const supabase = await getSupabaseClient();
      const { error } = await supabase
        .from('vendors')
        .update({ is_active: !isActive })
        .eq('id', vendorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Vendor ${isActive ? 'deactivated' : 'activated'} successfully`,
      });

      fetchVendors();
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      toast({
        title: "Error",
        description: "Failed to update vendor status",
        variant: "destructive",
      });
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'pending') return matchesSearch && !vendor.is_approved;
    if (filter === 'approved') return matchesSearch && vendor.is_approved;
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Vendors</h1>
          <p className="text-muted-foreground mt-1">
            Manage vendor applications and active vendors
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'approved' ? 'default' : 'outline'}
              onClick={() => setFilter('approved')}
            >
              Approved
            </Button>
          </div>
        </div>

        {/* Vendors Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">Store</th>
                    <th className="text-left p-4 font-medium">Owner</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Commission</th>
                    <th className="text-left p-4 font-medium">Applied</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{vendor.store_name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {vendor.profile?.display_name || "Unknown"}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className={
                                vendor.is_approved
                                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                                  : "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
                              }
                            >
                              {vendor.is_approved ? "Approved" : "Pending"}
                            </Badge>
                            {vendor.is_approved && (
                              <Badge
                                variant="outline"
                                className={
                                  vendor.is_active
                                    ? "bg-blue-500/20 text-blue-500 border-blue-500/30"
                                    : "bg-gray-500/20 text-gray-500 border-gray-500/30"
                                }
                              >
                                {vendor.is_active ? "Active" : "Inactive"}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">{vendor.commission_rate}%</td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(vendor.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVendor(vendor);
                                  setIsDetailOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {!vendor.is_approved && (
                                <>
                                  <DropdownMenuItem onClick={() => approveVendor(vendor.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => rejectVendor(vendor.id)}
                                    className="text-destructive"
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {vendor.is_approved && (
                                <DropdownMenuItem
                                  onClick={() => toggleVendorStatus(vendor.id, vendor.is_active)}
                                >
                                  {vendor.is_active ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedVendor?.store_name}</DialogTitle>
            </DialogHeader>
            {selectedVendor && (
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedVendor.store_description || "No description"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <p className="font-medium">{selectedVendor.commission_rate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {selectedVendor.is_approved
                        ? selectedVendor.is_active
                          ? "Active"
                          : "Inactive"
                        : "Pending Approval"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p>{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default VendorsPage;
