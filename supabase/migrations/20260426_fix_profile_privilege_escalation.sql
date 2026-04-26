-- =====================================================================
-- SECURITY FIX: Block self-promotion via profiles UPDATE
-- =====================================================================
-- Issue:
--   The "Users can update own profile" / "Users can upsert own profile"
--   RLS policies allowed authenticated users to UPDATE *any* column on
--   their own row, including `is_admin`, `membership_tier`,
--   `membership_expires_at`. A signed-in user could call
--     supabase.from('profiles').update({ is_admin: true }).eq('id', myId)
--   directly from the browser with the public anon key and become admin
--   (full access to /api/admin/* endpoints) or upgrade themselves to a
--   paid `membership_tier` and bypass payment gating.
--
-- Fix:
--   Use Postgres column-level privileges (independent from RLS) to ensure
--   the `authenticated` and `anon` roles cannot UPDATE these sensitive
--   columns. The `service_role` (used server-side via
--   SUPABASE_SERVICE_ROLE_KEY) keeps full access for legitimate updates
--   from webhook handlers / admin code paths.
-- =====================================================================

-- 1. Revoke direct UPDATE on sensitive columns for client-facing roles.
REVOKE UPDATE (is_admin, membership_tier, membership_expires_at)
  ON public.profiles
  FROM authenticated, anon;

-- 2. Be explicit about which non-sensitive columns clients may update.
--    (Existing default GRANT may already include these; re-stating keeps
--    the intent obvious to future readers.)
GRANT UPDATE (
  display_name,
  avatar_url,
  bio,
  profession,
  expertise,
  years_experience,
  website,
  linkedin,
  subscribe_newsletter,
  username,
  line_uid,
  line_display_name,
  line_picture_url,
  line_linked_at,
  updated_at
) ON public.profiles TO authenticated;

-- 3. Service role bypasses column GRANTs by default but make it explicit.
GRANT ALL ON public.profiles TO service_role;

-- 4. Defense-in-depth: a trigger that double-checks no client-side path
--    silently bypasses (e.g. via SECURITY DEFINER functions someone may
--    add later) and that gives a clearer error message than "permission
--    denied for column".
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER AS $$
DECLARE
  caller_role TEXT;
  is_caller_admin BOOLEAN;
BEGIN
  caller_role := COALESCE(
    current_setting('request.jwt.claims', true)::jsonb ->> 'role',
    ''
  );

  -- Server-side service role / direct DB sessions bypass.
  IF caller_role = 'service_role' OR auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Existing admins may modify these columns (e.g. promoting another
  -- admin via the dashboard).
  SELECT COALESCE(p.is_admin, false) INTO is_caller_admin
  FROM public.profiles p
  WHERE p.id = auth.uid();

  IF is_caller_admin THEN
    RETURN NEW;
  END IF;

  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    RAISE EXCEPTION 'Cannot modify is_admin' USING ERRCODE = '42501';
  END IF;
  IF NEW.membership_tier IS DISTINCT FROM OLD.membership_tier THEN
    RAISE EXCEPTION 'Cannot modify membership_tier' USING ERRCODE = '42501';
  END IF;
  IF NEW.membership_expires_at IS DISTINCT FROM OLD.membership_expires_at THEN
    RAISE EXCEPTION 'Cannot modify membership_expires_at' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_profile_sensitive_columns_trigger ON public.profiles;
CREATE TRIGGER protect_profile_sensitive_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_sensitive_columns();
