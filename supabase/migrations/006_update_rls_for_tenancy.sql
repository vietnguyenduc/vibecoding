-- Migration: 006_update_rls_for_tenancy.sql
-- Description: Update Row Level Security policies for multi-tenancy
-- Date: 2024-01-01
-- Drop existing policies (they'll be replaced with tenant-aware versions)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their branch" ON public.branches;
DROP POLICY IF EXISTS "Admins can manage all branches" ON public.branches;
DROP POLICY IF EXISTS "Users can view their branch bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can manage their branch bank accounts" ON public.bank_accounts;
DROP POLICY IF EXISTS "Users can view their branch customers" ON public.customers;
DROP POLICY IF EXISTS "Users can manage their branch customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view their branch transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create transactions for their branch" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their branch transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their branch transactions" ON public.transactions;
-- New tenant-aware policies for users (using public schema functions)
CREATE POLICY "Users can view their own profile" ON public.users FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view same tenant users" ON public.users FOR
SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY "Tenant admins can manage tenant users" ON public.users FOR ALL USING (
    tenant_id = public.current_tenant_id()
    AND public.is_tenant_admin()
);
-- New tenant-aware policies for branches
CREATE POLICY "Users can view their tenant branches" ON public.branches FOR
SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY "Branch managers can view their branch" ON public.branches FOR
SELECT USING (
        tenant_id = public.current_tenant_id()
        AND (
            id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Tenant admins can manage tenant branches" ON public.branches FOR ALL USING (
    tenant_id = public.current_tenant_id()
    AND public.is_tenant_admin()
);
-- New tenant-aware policies for bank accounts
CREATE POLICY "Users can view their tenant bank accounts" ON public.bank_accounts FOR
SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY "Users can view their branch bank accounts" ON public.bank_accounts FOR
SELECT USING (
        tenant_id = public.current_tenant_id()
        AND (
            branch_id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Branch managers can manage their branch bank accounts" ON public.bank_accounts FOR ALL USING (
    tenant_id = public.current_tenant_id()
    AND (
        branch_id = (
            SELECT branch_id
            FROM public.users
            WHERE id = auth.uid()
        )
        OR public.is_tenant_admin()
    )
);
-- New tenant-aware policies for customers
CREATE POLICY "Users can view their tenant customers" ON public.customers FOR
SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY "Users can view their branch customers" ON public.customers FOR
SELECT USING (
        tenant_id = public.current_tenant_id()
        AND (
            branch_id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Users can manage their branch customers" ON public.customers FOR ALL USING (
    tenant_id = public.current_tenant_id()
    AND (
        branch_id = (
            SELECT branch_id
            FROM public.users
            WHERE id = auth.uid()
        )
        OR public.is_tenant_admin()
    )
);
-- New tenant-aware policies for transactions
CREATE POLICY "Users can view their tenant transactions" ON public.transactions FOR
SELECT USING (tenant_id = public.current_tenant_id());
CREATE POLICY "Users can view their branch transactions" ON public.transactions FOR
SELECT USING (
        tenant_id = public.current_tenant_id()
        AND (
            branch_id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Users can create transactions for their branch" ON public.transactions FOR
INSERT WITH CHECK (
        tenant_id = public.current_tenant_id()
        AND (
            branch_id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Users can update their branch transactions" ON public.transactions FOR
UPDATE USING (
        tenant_id = public.current_tenant_id()
        AND (
            branch_id = (
                SELECT branch_id
                FROM public.users
                WHERE id = auth.uid()
            )
            OR public.is_tenant_admin()
        )
    );
CREATE POLICY "Users can delete their branch transactions" ON public.transactions FOR DELETE USING (
    tenant_id = public.current_tenant_id()
    AND (
        branch_id = (
            SELECT branch_id
            FROM public.users
            WHERE id = auth.uid()
        )
        OR public.is_tenant_admin()
    )
);