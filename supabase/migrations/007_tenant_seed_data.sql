-- Migration: 007_tenant_seed_data.sql
-- Description: Sample tenant data for multi-tenant setup
-- Date: 2024-01-01
-- Insert sample tenants
INSERT INTO public.tenants (id, name, slug, domain, is_active)
VALUES (
        '550e8400-e29b-41d4-a716-446655440001',
        'ABC Company Ltd',
        'abc-company',
        'abc.example.com',
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440002',
        'XYZ Corporation',
        'xyz-corp',
        'xyz.example.com',
        true
    ),
    (
        '550e8400-e29b-41d4-a716-446655440003',
        'Demo Client Inc',
        'demo-client',
        'demo.example.com',
        true
    );
-- Update existing sample branches with tenant_id
UPDATE public.branches
SET tenant_id = '550e8400-e29b-41d4-a716-446655440001'
WHERE code IN ('MB001');
UPDATE public.branches
SET tenant_id = '550e8400-e29b-41d4-a716-446655440002'
WHERE code IN ('NB001', 'SB001');
UPDATE public.branches
SET tenant_id = '550e8400-e29b-41d4-a716-446655440003'
WHERE code IN ('EB001', 'WB001');
-- Update existing sample bank accounts with tenant_id
UPDATE public.bank_accounts
SET tenant_id = (
        SELECT tenant_id
        FROM public.branches
        WHERE branches.id = bank_accounts.branch_id
    );
-- Update existing sample customers with tenant_id
UPDATE public.customers
SET tenant_id = (
        SELECT tenant_id
        FROM public.branches
        WHERE branches.id = customers.branch_id
    );
-- Add sample tenants-specific data
INSERT INTO public.branches (
        name,
        code,
        address,
        phone,
        email,
        tenant_id,
        is_active
    )
VALUES -- ABC Company branches
    (
        'ABC Head Office',
        'ABC-HQ',
        '123 Business District, Ho Chi Minh City',
        '+84-28-1234-5678',
        'hq@abc-company.vn',
        '550e8400-e29b-41d4-a716-446655440001',
        true
    ),
    (
        'ABC Branch North',
        'ABC-BN',
        '456 North Avenue, Hanoi',
        '+84-24-1234-5678',
        'north@abc-company.vn',
        '550e8400-e29b-41d4-a716-446655440001',
        true
    ),
    -- XYZ Corporation branches  
    (
        'XYZ Central Office',
        'XYZ-CO',
        '789 Central Plaza, Ho Chi Minh City',
        '+84-28-8765-4321',
        'central@xyz-corp.vn',
        '550e8400-e29b-41d4-a716-446655440002',
        true
    ),
    (
        'XYZ Branch South',
        'XYZ-BS',
        '321 South District, Can Tho',
        '+84-292-8765-4321',
        'south@xyz-corp.vn',
        '550e8400-e29b-41d4-a716-446655440002',
        true
    ),
    -- Demo Client branches
    (
        'Demo Main Office',
        'DEMO-MO',
        '147 Demo Street, Demo City',
        '+84-28-9999-0000',
        'main@demo-client.com',
        '550e8400-e29b-41d4-a716-446655440003',
        true
    );
-- Add corresponding bank accounts for new branches
INSERT INTO public.bank_accounts (
        account_number,
        account_name,
        bank_name,
        branch_id,
        tenant_id
    )
VALUES -- ABC Company accounts
    (
        'ABC1234567890',
        'ABC Main Account',
        'Vietcombank',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-HQ'
        ),
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    (
        'ABC0987654321',
        'ABC North Account',
        'BIDV',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'ABC-BN'
        ),
        '550e8400-e29b-41d4-a716-446655440001'
    ),
    -- XYZ Corporation accounts
    (
        'XYZ1122334455',
        'XYZ Central Account',
        'Techcombank',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'XYZ-CO'
        ),
        '550e8400-e29b-41d4-a716-446655440002'
    ),
    (
        'XYZ5566778899',
        'XYZ South Account',
        'ACB',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'XYZ-BS'
        ),
        '550e8400-e29b-41d4-a716-446655440002'
    ),
    -- Demo Client accounts
    (
        'DEMO9988776655',
        'Demo Main Account',
        'MB Bank',
        (
            SELECT id
            FROM public.branches
            WHERE code = 'DEMO-MO'
        ),
        '550e8400-e29b-41d4-a716-446655440003'
    );
-- Create a trigger to automatically set tenant_id for new records
CREATE OR REPLACE FUNCTION set_tenant_id_from_user() RETURNS TRIGGER AS $$ BEGIN IF NEW.tenant_id IS NULL THEN NEW.tenant_id := (
        SELECT tenant_id
        FROM public.users
        WHERE id = auth.uid()
    );
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Apply the trigger to relevant tables
CREATE TRIGGER set_tenant_id_branches BEFORE
INSERT ON public.branches FOR EACH ROW EXECUTE FUNCTION set_tenant_id_from_user();
CREATE TRIGGER set_tenant_id_bank_accounts BEFORE
INSERT ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION set_tenant_id_from_user();
CREATE TRIGGER set_tenant_id_customers BEFORE
INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION set_tenant_id_from_user();
CREATE TRIGGER set_tenant_id_transactions BEFORE
INSERT ON public.transactions FOR EACH ROW EXECUTE FUNCTION set_tenant_id_from_user();