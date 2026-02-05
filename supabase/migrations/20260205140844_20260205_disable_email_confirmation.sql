/*
  # Disable Email Confirmation for Immediate Access
  
  This migration disables email confirmation requirement so users can sign up and sign in immediately.
  Email confirmation will still be optional for account security, but not required for access.
  
  Note: This is configured at the Supabase project level in the Auth settings.
  In the Supabase dashboard, set:
  - Email confirmations: OFF
  - Double confirm email changes: OFF
*/

-- This is a placeholder migration
-- The actual email confirmation setting needs to be disabled in the Supabase dashboard:
-- 1. Go to Authentication > Providers > Email
-- 2. Toggle "Confirm email" OFF
-- 3. Toggle "Double confirm email changes" OFF
SELECT 1;
