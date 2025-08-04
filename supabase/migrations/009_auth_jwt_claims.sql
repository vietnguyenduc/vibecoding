-- Migration: 009_auth_jwt_claims.sql
-- Description: Set up JWT custom claims for multi-tenancy
-- Date: 2024-01-01
-- Function to set JWT custom claims with tenant_id
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN -- Insert user profile in public.users table
INSERT INTO public.users (id, email, full_name, tenant_id)
VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(
            (NEW.raw_user_meta_data->>'tenant_id')::uuid,
            '550e8400-e29b-41d4-a716-446655440001'::uuid
        )
    ) ON CONFLICT (id) DO
UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    tenant_id = EXCLUDED.tenant_id;
-- Update JWT claims with tenant_id
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object(
        'tenant_id',
        COALESCE(
            (NEW.raw_user_meta_data->>'tenant_id')::uuid,
            '550e8400-e29b-41d4-a716-446655440001'::uuid
        )
    )
WHERE id = NEW.id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
-- Function to refresh JWT claims when user tenant changes
CREATE OR REPLACE FUNCTION public.refresh_user_jwt_claims(user_id uuid, new_tenant_id uuid) RETURNS void AS $$ BEGIN -- Update user's tenant_id
UPDATE public.users
SET tenant_id = new_tenant_id
WHERE id = user_id;
-- Update JWT claims
UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('tenant_id', new_tenant_id)
WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon,
    authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon,
    authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_user_jwt_claims(uuid, uuid) TO authenticated;
SELECT 'JWT custom claims setup completed successfully!' as result;