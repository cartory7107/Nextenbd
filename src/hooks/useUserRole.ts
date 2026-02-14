import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabaseClient } from "@/integrations/supabase/lazyClient";

export type AppRole = 'super_admin' | 'admin' | 'vendor' | 'shareholder' | 'developer' | 'user';
export type AppPermission = 
  | 'manage_users'
  | 'manage_vendors'
  | 'manage_products'
  | 'manage_orders'
  | 'manage_categories'
  | 'view_analytics'
  | 'manage_settings'
  | 'manage_roles'
  | 'manage_permissions'
  | 'manage_payments'
  | 'view_reports'
  | 'manage_inventory';

interface UserRoleData {
  roles: AppRole[];
  permissions: AppPermission[];
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  hasPermission: (permission: AppPermission) => boolean;
  hasRole: (role: AppRole) => boolean;
  refetch: () => Promise<void>;
}

export const useUserRole = (): UserRoleData => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<AppPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRolesAndPermissions = async () => {
    if (!user) {
      setRoles([]);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    try {
      const supabase = await getSupabaseClient();
      
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      const userRoles = (rolesData || []).map(r => r.role as AppRole);
      setRoles(userRoles);

      // Fetch user permissions
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('user_id', user.id);

      if (permissionsError) throw permissionsError;

      const userPermissions = (permissionsData || []).map(p => p.permission as AppPermission);
      setPermissions(userPermissions);
    } catch (error) {
      console.error('Error fetching roles/permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndPermissions();
  }, [user]);

  const isSuperAdmin = roles.includes('super_admin');
  const isAdmin = roles.includes('admin') || isSuperAdmin;
  const isVendor = roles.includes('vendor');

  const hasPermission = (permission: AppPermission): boolean => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    permissions,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isVendor,
    hasPermission,
    hasRole,
    refetch: fetchRolesAndPermissions,
  };
};
