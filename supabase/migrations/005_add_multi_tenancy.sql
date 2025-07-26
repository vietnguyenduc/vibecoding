-- Migration: 005_add_multi_tenancy.sql
-- Description: Add multi-tenancy support to the debt repayment application
-- Date: 2024-01-01
-- Create tenants table
CREATE TABLE public.tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    -- URL-friendly identifier like "company-abc"
    domain TEXT,
    -- Optional custom domain
    settings JSONB DEFAULT '{}',
    -- Tenant-specific settings
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Add tenant_id to all existing tables
ALTER TABLE public.users
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.branches
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.bank_accounts
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.customers
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
ALTER TABLE public.transactions
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);
-- Make tenant_id NOT NULL for data integrity (after adding to existing tables)
-- Note: In production, you'd need to populate these first before making them NOT NULL
-- ALTER TABLE public.users ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.branches ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.bank_accounts ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.customers ALTER COLUMN tenant_id SET NOT NULL;
-- ALTER TABLE public.transactions ALTER COLUMN tenant_id SET NOT NULL;
-- Add indexes for tenant_id columns for better performance
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_users_tenant_id ON public.users(tenant_id);
CREATE INDEX idx_branches_tenant_id ON public.branches(tenant_id);
CREATE INDEX idx_bank_accounts_tenant_id ON public.bank_accounts(tenant_id);
CREATE INDEX idx_customers_tenant_id ON public.customers(tenant_id);
CREATE INDEX idx_transactions_tenant_id ON public.transactions(tenant_id);
-- Add composite indexes for common queries
CREATE INDEX idx_customers_tenant_branch ON public.customers(tenant_id, branch_id);
CREATE INDEX idx_transactions_tenant_customer ON public.transactions(tenant_id, customer_id);
CREATE INDEX idx_transactions_tenant_date ON public.transactions(tenant_id, transaction_date);
-- Update unique constraints to be tenant-scoped
ALTER TABLE public.branches DROP CONSTRAINT IF EXISTS branches_code_key;
ALTER TABLE public.branches
ADD CONSTRAINT branches_tenant_code_unique UNIQUE (tenant_id, code);
ALTER TABLE public.customers DROP CONSTRAINT IF EXISTS customers_customer_code_key;
ALTER TABLE public.customers
ADD CONSTRAINT customers_tenant_code_unique UNIQUE (tenant_id, customer_code);
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_transaction_code_key;
ALTER TABLE public.transactions
ADD CONSTRAINT transactions_tenant_code_unique UNIQUE (tenant_id, transaction_code);
-- Enable Row Level Security for tenants table
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
-- Create function to get current user's tenant_id from JWT (in public schema)
CREATE OR REPLACE FUNCTION public.current_tenant_id() RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER AS $$
SELECT COALESCE(
        (auth.jwt()->>'tenant_id')::UUID,
        (
            SELECT tenant_id
            FROM public.users
            WHERE id = auth.uid()
        )
    );
$$;
-- Create function to check if user is admin of their tenant (in public schema)
CREATE OR REPLACE FUNCTION public.is_tenant_admin() RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
SELECT EXISTS (
        SELECT 1
        FROM public.users
        WHERE id = auth.uid()
            AND tenant_id = public.current_tenant_id()
            AND role = 'admin'
    );
$$;
-- Tenant-specific RLS policies (using public schema functions)
CREATE POLICY "Users can view their tenant" ON public.tenants FOR
SELECT USING (id = public.current_tenant_id());
CREATE POLICY "Tenant admins can manage their tenant" ON public.tenants FOR ALL USING (
    id = public.current_tenant_id()
    AND public.is_tenant_admin()
);