# Multi-Tenant Database Setup Guide

## Overview

This guide explains how to set up and use the multi-tenant database structure for the Debt and Repayment Web Application. The system supports multiple clients (tenants) with complete data isolation.

## Architecture

### Multi-Tenancy Strategy

- **Approach**: Single database, shared schema with tenant isolation
- **Isolation**: Row-Level Security (RLS) policies ensure data separation
- **Identification**: Each tenant has a unique `tenant_id` UUID

### Database Structure

```
tenants (master tenant table)
├── users (tenant-specific users)
├── branches (tenant-specific branches)
├── bank_accounts (tenant-specific accounts)
├── customers (tenant-specific customers)
└── transactions (tenant-specific transactions)
```

## Setup Instructions

### 1. Run Database Migrations

```bash
# Navigate to your project directory
cd your-project

# Run Supabase migrations
npx supabase db push

# Or if using Supabase CLI
supabase db push
```

### 2. Create Your First Tenant

```sql
INSERT INTO public.tenants (name, slug, domain, is_active) VALUES
('Your Company Name', 'your-company', 'your-domain.com', true);
```

### 3. Set Up User Authentication with Tenant Context

When users sign up or sign in, you need to associate them with a tenant. Here are two approaches:

#### Option A: Use Custom Claims in JWT

Update your authentication flow to include `tenant_id` in the JWT:

```javascript
// In your auth service
const signInUser = async (email, password, tenantSlug) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (data.user) {
    // Get tenant_id from slug
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single();

    // Update user metadata with tenant_id
    await supabase.auth.updateUser({
      data: { tenant_id: tenant.id },
    });
  }

  return { data, error };
};
```

#### Option B: Store tenant_id in users table

```sql
-- Associate user with tenant during signup
INSERT INTO public.users (id, email, full_name, tenant_id, role)
VALUES (auth.uid(), 'user@example.com', 'User Name', 'tenant-uuid', 'staff');
```

### 4. Update Your Application Code

#### Database Service Updates

Update your database services to always include tenant context:

```typescript
// src/services/database.ts
export const customerService = {
  async getCustomers(filters: any = {}) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      // RLS automatically filters by tenant_id
      .eq('is_active', filters.is_active ?? true);

    return { data, error };
  },

  async createCustomer(customerData: any) {
    const { data, error } = await supabase.from('customers').insert({
      ...customerData,
      // tenant_id is automatically set by trigger
    });

    return { data, error };
  },
};
```

#### Component Updates

Your existing components should work without changes because RLS handles filtering automatically:

```tsx
// This will only show customers from the current user's tenant
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const loadCustomers = async () => {
      const { data } = await customerService.getCustomers();
      setCustomers(data || []);
    };

    loadCustomers();
  }, []);

  // Rest of component remains the same
};
```

## Tenant Management

### Adding New Tenants

```sql
INSERT INTO public.tenants (name, slug, domain, settings, is_active) VALUES
('New Client Corp', 'new-client', 'newclient.com', '{"currency": "VND", "language": "vi"}', true);
```

### User Management per Tenant

```sql
-- Add user to specific tenant
INSERT INTO public.users (id, email, full_name, tenant_id, role, branch_id)
VALUES (
  'user-uuid',
  'manager@newclient.com',
  'Tenant Manager',
  (SELECT id FROM public.tenants WHERE slug = 'new-client'),
  'admin',
  NULL
);
```

### Branch Setup per Tenant

```sql
-- Add branches for a tenant
INSERT INTO public.branches (name, code, address, phone, email, tenant_id) VALUES
('New Client HQ', 'NC-HQ', '123 Main St', '+84-123-456-789', 'hq@newclient.com',
 (SELECT id FROM public.tenants WHERE slug = 'new-client'));
```

## Security Features

### Row-Level Security (RLS)

All tables have RLS policies that ensure:

- Users can only access data from their own tenant
- Admins can manage all data within their tenant
- Complete isolation between tenants

### Helper Functions

```sql
-- Get current user's tenant_id
SELECT auth.current_tenant_id();

-- Check if current user is tenant admin
SELECT auth.is_tenant_admin();
```

## Testing Multi-Tenancy

### Create Test Data

```sql
-- Create test tenants
INSERT INTO public.tenants (id, name, slug) VALUES
('test-tenant-1', 'Test Company A', 'test-a'),
('test-tenant-2', 'Test Company B', 'test-b');

-- Create test users for each tenant
INSERT INTO public.users (id, email, tenant_id, role) VALUES
('user-1', 'admin@test-a.com', 'test-tenant-1', 'admin'),
('user-2', 'admin@test-b.com', 'test-tenant-2', 'admin');
```

### Verify Isolation

```sql
-- Switch to user-1 context and verify only seeing tenant-1 data
SET LOCAL row_security.auth_uid = 'user-1';
SELECT * FROM public.customers; -- Should only show tenant-1 customers

-- Switch to user-2 context and verify only seeing tenant-2 data
SET LOCAL row_security.auth_uid = 'user-2';
SELECT * FROM public.customers; -- Should only show tenant-2 customers
```

## Production Considerations

### 1. Performance

- All tenant-scoped queries use indexes on `tenant_id`
- Consider partitioning large tables by `tenant_id` if needed
- Monitor query performance with EXPLAIN ANALYZE

### 2. Backup and Recovery

- Backups include all tenants by default
- Consider tenant-specific backup strategies if needed
- Test restore procedures for individual tenants

### 3. Monitoring

- Monitor tenant-specific usage and performance
- Set up alerts for tenant-specific issues
- Track tenant growth and resource usage

### 4. Migrations

- Test migrations with multiple tenants
- Consider tenant-specific migration rollback strategies
- Validate data integrity across all tenants

## Troubleshooting

### Common Issues

1. **User can't see any data**
   - Check if user has correct `tenant_id`
   - Verify RLS policies are enabled
   - Check JWT contains correct tenant information

2. **Data appearing in wrong tenant**
   - Verify triggers are setting `tenant_id` correctly
   - Check application code isn't manually setting wrong `tenant_id`
   - Validate RLS policies are restrictive enough

3. **Performance issues**
   - Check if queries are using tenant indexes
   - Consider adding composite indexes for common query patterns
   - Monitor for cross-tenant queries

### Debug Queries

```sql
-- Check current user's tenant context
SELECT
  auth.uid() as user_id,
  auth.current_tenant_id() as tenant_id,
  auth.is_tenant_admin() as is_admin;

-- See all policies on a table
SELECT * FROM pg_policies WHERE tablename = 'customers';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

## Migration from Single Tenant

If you have an existing single-tenant installation:

1. **Backup your data**
2. **Run the multi-tenant migrations**
3. **Create a tenant for existing data**
4. **Update existing records with tenant_id**
5. **Test thoroughly before going live**

Example migration script:

```sql
-- Create tenant for existing data
INSERT INTO public.tenants (id, name, slug) VALUES
('legacy-tenant-id', 'Legacy Company', 'legacy');

-- Update all existing records
UPDATE public.users SET tenant_id = 'legacy-tenant-id';
UPDATE public.branches SET tenant_id = 'legacy-tenant-id';
UPDATE public.customers SET tenant_id = 'legacy-tenant-id';
UPDATE public.transactions SET tenant_id = 'legacy-tenant-id';
UPDATE public.bank_accounts SET tenant_id = 'legacy-tenant-id';
```
