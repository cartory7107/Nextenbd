
-- 2. Fix profiles RLS: Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. Fix user_roles RLS
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins with permission can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins with permission can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_permission(auth.uid(), 'manage_roles'::app_permission));

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins with permission can insert roles"
  ON public.user_roles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_permission(auth.uid(), 'manage_roles'::app_permission));

CREATE POLICY "Admins with permission can delete roles"
  ON public.user_roles FOR DELETE
  TO authenticated
  USING (public.has_permission(auth.uid(), 'manage_roles'::app_permission));

-- 4. Fix role_permissions RLS
DROP POLICY IF EXISTS "Admins with permission can view permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admins with permission can manage permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Super admins can manage all permissions" ON public.role_permissions;

CREATE POLICY "Users can view their own permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all permissions"
  ON public.role_permissions FOR SELECT
  TO authenticated
  USING (public.has_permission(auth.uid(), 'manage_permissions'::app_permission));

CREATE POLICY "Super admins can manage all permissions"
  ON public.role_permissions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins with permission can insert permissions"
  ON public.role_permissions FOR INSERT
  TO authenticated
  WITH CHECK (public.has_permission(auth.uid(), 'manage_permissions'::app_permission));

CREATE POLICY "Admins with permission can delete permissions"
  ON public.role_permissions FOR DELETE
  TO authenticated
  USING (public.has_permission(auth.uid(), 'manage_permissions'::app_permission));

-- 5. Fix vendors RLS
DROP POLICY IF EXISTS "Admins can manage all vendors" ON public.vendors;
DROP POLICY IF EXISTS "Anyone can view approved vendors" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can update their own store" ON public.vendors;
DROP POLICY IF EXISTS "Vendors can view their own store" ON public.vendors;

CREATE POLICY "Users can submit vendor application"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can view their own store"
  ON public.vendors FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view approved vendors"
  ON public.vendors FOR SELECT
  USING (is_approved = true AND is_active = true);

CREATE POLICY "Vendors can update their own store"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all vendors"
  ON public.vendors FOR ALL
  TO authenticated
  USING (public.has_permission(auth.uid(), 'manage_vendors'::app_permission))
  WITH CHECK (public.has_permission(auth.uid(), 'manage_vendors'::app_permission));

-- 6. Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();
