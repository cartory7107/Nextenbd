

## সমস্যা কী? (What's the problem?)

তোমার backend-এ দুইটা বড় সমস্যা আছে:

1. **Triggers নেই** — `handle_new_user()` আর `handle_new_user_role()` functions আছে, কিন্তু `auth.users` table-এ triggers attach করা হয়নি। তাই নতুন user signup করলে profile তৈরি হয় না, role assign হয় না।

2. **Email confirmation** — signup-এর পর email verify করতে হয়, কিন্তু preview-তে env vars load হয় না বলে কিছুই কাজ করে না। Auto-confirm enable করলে email verification ছাড়াই login করা যাবে।

3. **Preview iframe limitation** — Preview-তে `supabaseUrl is required` error আসে কারণ environment variables inject হয় না। **Published URL-এ (nextenbd.lovable.app) সব কাজ করবে।**

---

## সমাধান পরিকল্পনা (Solution Plan)

### Step 1: Database Migration — Triggers তৈরি করা
Auth triggers attach করতে হবে `auth.users` table-এ:

```sql
-- Profile auto-create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Role auto-assign trigger  
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
```

### Step 2: Auto-confirm Email Enable করা
Email verification বাদ দিয়ে সরাসরি signup-এর পর login করা যাবে। `configure_auth` tool দিয়ে auto-confirm চালু করা হবে।

### Step 3: Code Verification
- `AuthContext.tsx` — signup-এর পর auto-login logic ঠিক আছে কিনা verify করা
- `AuthPage.tsx` — error handling ঠিক আছে কিনা check করা

---

## কোথায় টেস্ট করতে হবে?
- Preview-তে কাজ করবে না (env var issue)
- **Publish করার পর** `https://nextenbd.lovable.app/auth` এ গিয়ে test করো
- Email/password sign up আর Google sign in দুইটাই কাজ করবে

