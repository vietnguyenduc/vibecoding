# Manual Database Migration Instructions

## 🎯 Next Steps to Complete Multi-Tenant Setup

Your Supabase connection is working correctly! Now you need to apply the database migrations manually through the Supabase dashboard.

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project: **ksdoenyfaeapyzbtontv**
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run Migrations in Order

Copy and paste each SQL file content into the SQL Editor and run them **in this exact order**:

#### Migration 1: Add Multi-Tenancy Support

📁 File: `supabase/migrations/005_add_multi_tenancy.sql`

1. Open the file in your project
2. Copy the entire content
3. Paste it into the Supabase SQL Editor
4. Click **Run** button
5. ✅ Verify it completes without errors

#### Migration 2: Update RLS Policies

📁 File: `supabase/migrations/006_update_rls_for_tenancy.sql`

1. Open the file in your project
2. Copy the entire content
3. Paste it into the Supabase SQL Editor
4. Click **Run** button
5. ✅ Verify it completes without errors

#### Migration 3: Add Sample Data

📁 File: `supabase/migrations/007_tenant_seed_data.sql`

1. Open the file in your project
2. Copy the entire content
3. Paste it into the Supabase SQL Editor
4. Click **Run** button
5. ✅ Verify it completes without errors

### Step 3: Verify Database Structure

After running all migrations, you should see these new tables in your **Table Editor**:

- ✅ `tenants` - Master tenant table
- ✅ `users` - Updated with `tenant_id` column
- ✅ `branches` - Updated with `tenant_id` column
- ✅ `customers` - Updated with `tenant_id` column
- ✅ `transactions` - Updated with `tenant_id` column
- ✅ `bank_accounts` - Updated with `tenant_id` column

### Step 4: Test Your Setup

After completing the migrations, run this command to test:

```bash
node scripts/test-multitenant.cjs
```

### Step 5: Update Your Application

Once migrations are complete, your app will automatically use the real database instead of mock data!

---

## 🚨 Troubleshooting

### If you get errors during migration:

1. **"relation already exists"** - Some tables might already exist, skip those statements
2. **"permission denied"** - Make sure you're using the SQL Editor as the project owner
3. **"syntax error"** - Check that you copied the entire file content correctly

### Common Issues:

- Make sure to run migrations **in order** (005 → 006 → 007)
- If a migration partially fails, you may need to manually clean up before retrying
- Check the **Logs** tab in Supabase for detailed error messages

---

## 📞 After Migration Success

Once migrations are complete:

1. ✅ Your database will have multi-tenant structure
2. ✅ Sample tenants will be created
3. ✅ Your app will connect to real Supabase data
4. ✅ All RLS policies will be in place for security

Then you can:

- Create your first real tenant
- Add users to tenants
- Test the multi-tenant isolation
- Start using the application with real data!
