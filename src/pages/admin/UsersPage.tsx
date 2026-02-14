import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Shield, MoreVertical, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getSupabaseClient } from "@/integrations/supabase/lazyClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "./AdminLayout";
import { AppRole, AppPermission } from "@/hooks/useUserRole";

interface UserWithRoles {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  roles: AppRole[];
  permissions: AppPermission[];
}

const ALL_ROLES: AppRole[] = ['super_admin', 'admin', 'vendor', 'shareholder', 'developer', 'user'];
const ALL_PERMISSIONS: AppPermission[] = [
  'manage_users',
  'manage_vendors',
  'manage_products',
  'manage_orders',
  'manage_categories',
  'view_analytics',
  'manage_settings',
  'manage_roles',
  'manage_permissions',
  'manage_payments',
  'view_reports',
  'manage_inventory',
];

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<AppPermission[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    try {
      const supabase = await getSupabaseClient();
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Fetch all permissions
      const { data: permissions, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('*');

      if (permissionsError) throw permissionsError;

      // Combine data
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        ...profile,
        roles: (roles || [])
          .filter((r) => r.user_id === profile.user_id)
          .map((r) => r.role as AppRole),
        permissions: (permissions || [])
          .filter((p) => p.user_id === profile.user_id)
          .map((p) => p.permission as AppPermission),
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openRoleDialog = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles);
    setIsRoleDialogOpen(true);
  };

  const openPermissionDialog = (user: UserWithRoles) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions);
    setIsPermissionDialogOpen(true);
  };

  const handleRoleChange = (role: AppRole, checked: boolean) => {
    if (checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    }
  };

  const handlePermissionChange = (permission: AppPermission, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permission]);
    } else {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    }
  };

  const saveRoles = async () => {
    if (!selectedUser || !currentUser) return;
    setSaving(true);

    try {
      const supabase = await getSupabaseClient();
      // Delete existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', selectedUser.user_id);

      // Insert new roles
      if (selectedRoles.length > 0) {
        const { error } = await supabase.from('user_roles').insert(
          selectedRoles.map((role) => ({
            user_id: selectedUser.user_id,
            role,
          }))
        );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Roles updated successfully",
      });

      setIsRoleDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving roles:', error);
      toast({
        title: "Error",
        description: "Failed to update roles",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const savePermissions = async () => {
    if (!selectedUser || !currentUser) return;
    setSaving(true);

    try {
      const supabase = await getSupabaseClient();
      // Delete existing permissions
      await supabase
        .from('role_permissions')
        .delete()
        .eq('user_id', selectedUser.user_id);

      // Insert new permissions
      if (selectedPermissions.length > 0) {
        const { error } = await supabase.from('role_permissions').insert(
          selectedPermissions.map((permission) => ({
            user_id: selectedUser.user_id,
            permission,
            granted_by: currentUser.id,
          }))
        );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });

      setIsPermissionDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'admin':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'vendor':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'shareholder':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'developer':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, roles, and permissions
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-medium">User</th>
                    <th className="text-left p-4 font-medium">Roles</th>
                    <th className="text-left p-4 font-medium">Permissions</th>
                    <th className="text-left p-4 font-medium">Joined</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              {user.display_name?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                              <p className="font-medium">{user.display_name || "No name"}</p>
                              <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                                {user.user_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {user.roles.length > 0 ? (
                              user.roles.map((role) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className={getRoleBadgeColor(role)}
                                >
                                  {role.replace('_', ' ')}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground text-sm">No roles</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {user.permissions.length} permissions
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Manage Roles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openPermissionDialog(user)}>
                                <Check className="h-4 w-4 mr-2" />
                                Manage Permissions
                              </DropdownMenuItem>
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

        {/* Role Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Manage Roles - {selectedUser?.display_name || "User"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {ALL_ROLES.map((role) => (
                <div key={role} className="flex items-center space-x-3">
                  <Checkbox
                    id={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={(checked) =>
                      handleRoleChange(role, checked as boolean)
                    }
                  />
                  <Label htmlFor={role} className="capitalize">
                    {role.replace('_', ' ')}
                  </Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveRoles} disabled={saving}>
                {saving ? "Saving..." : "Save Roles"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Permission Dialog */}
        <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Manage Permissions - {selectedUser?.display_name || "User"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
              {ALL_PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center space-x-3">
                  <Checkbox
                    id={permission}
                    checked={selectedPermissions.includes(permission)}
                    onCheckedChange={(checked) =>
                      handlePermissionChange(permission, checked as boolean)
                    }
                  />
                  <Label htmlFor={permission} className="capitalize">
                    {permission.replace(/_/g, ' ')}
                  </Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={savePermissions} disabled={saving}>
                {saving ? "Saving..." : "Save Permissions"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
