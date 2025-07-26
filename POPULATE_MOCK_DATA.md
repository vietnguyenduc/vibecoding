# 📊 Populate Mock Data Instructions

## Overview

This guide helps you add Vietnamese-style mock data to your Supabase database for testing your Debt and Repayment Web Application.

## 🎯 What You'll Get

- **1 Tenant**: ABC Company Ltd
- **1 Branch**: ABC Head Office in Ho Chi Minh City
- **1 Bank Account**: Vietcombank account
- **10 Vietnamese Companies**: Realistic customer data with Vietnamese company names
- **50-150 Transactions**: Randomized payment and charge transactions
- **Real Financial Data**: Negative balances showing debt relationships

## 📋 Mock Data Preview

### Customers Include:

- Công ty TNHH ABC Technology (-85M VND debt)
- Công ty CP XYZ Trading (-72M VND debt)
- Công ty TNHH DEF Manufacturing (-65M VND debt)
- Công ty TNHH GHI Logistics (-45M VND debt)
- And 6 more companies...

### Sample Data:

- **Vietnamese addresses** in Ho Chi Minh City
- **Vietnamese phone numbers** (mobile format)
- **Professional email addresses** (.com.vn domains)
- **Realistic debt amounts** (19M - 85M VND)
- **Recent transaction history** (last 60 days)

## 🚀 How to Add Mock Data

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in to your account
   - Select your project: `ksdoenyfaeapyzbtontv`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration**
   - Copy the entire contents of `supabase/migrations/008_vietnamese_mock_data.sql`
   - Paste it into the SQL editor
   - Click "Run" button

4. **Verify Success**
   - You should see: "Vietnamese mock data populated successfully!"
   - Check the "Table Editor" to see your new data

### Method 2: Command Line (Advanced)

If you have Supabase CLI installed:

```bash
# Run the migration
supabase db push
```

## 🔍 Verify Your Data

After running the migration, you can verify the data was added:

### Check in Supabase Dashboard:

1. Go to "Table Editor"
2. Check these tables:
   - `tenants` (should have ABC Company Ltd)
   - `branches` (should have ABC Head Office)
   - `customers` (should have 10 Vietnamese companies)
   - `transactions` (should have 50-150 transactions)
   - `bank_accounts` (should have Vietcombank account)

### Check in Your App:

1. Start your app: `npm run dev`
2. Create a user account or sign in
3. Navigate to Dashboard - you should see:
   - Total outstanding debt
   - Active customers count
   - Recent transactions
   - Charts with real data

## 🎮 Test Your Application

With mock data populated, you can now test:

### Dashboard Features:

- ✅ Financial metrics with real numbers
- ✅ Charts showing cash flow
- ✅ Recent transactions list
- ✅ Top customers by debt amount

### Customer Management:

- ✅ Browse 10 Vietnamese companies
- ✅ View individual customer details
- ✅ See transaction history for each customer

### Reports:

- ✅ Generate customer balance reports
- ✅ Create transaction reports
- ✅ Export data to Excel/CSV

### Data Import:

- ✅ Test import functionality with existing data structure

## 🧹 Clean Up (Optional)

If you want to remove the mock data later:

```sql
-- Run this in Supabase SQL Editor to remove mock data
DELETE FROM public.transactions WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM public.customers WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM public.bank_accounts WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM public.branches WHERE tenant_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM public.tenants WHERE id = '550e8400-e29b-41d4-a716-446655440001';
```

## 🔐 Authentication Note

The mock data will be visible to all users in your tenant. To see the data in your app:

1. **Create a user account** in your application
2. **Sign in** to the app
3. The data will be available through the multi-tenant system

## 🎯 Next Steps

After populating mock data:

1. **Test all features** with realistic data
2. **Create your own customers** to see how the system works
3. **Import additional data** using the CSV import feature
4. **Generate reports** to test the reporting functionality
5. **Customize the data** by modifying the migration file

## ❓ Troubleshooting

**Issue**: "Permission denied" or RLS errors
**Solution**: Make sure you're running the SQL in the Supabase dashboard as the project owner

**Issue**: "there is no unique or exclusion constraint" error
**Solution**: ✅ Fixed! Updated all ON CONFLICT clauses to use tenant-scoped composite constraints

**Issue**: "column reference tenant_id is ambiguous" error
**Solution**: ✅ Fixed! Renamed PL/pgSQL variable from `tenant_id` to `target_tenant_id` to avoid column conflicts

**Issue**: "Duplicate key" errors
**Solution**: The migration handles conflicts - you can run it multiple times safely

**Issue**: No data visible in app
**Solution**: Make sure you're signed in to the app and the tenant system is working

## 🎉 Success!

Once complete, your application will have realistic Vietnamese business data for comprehensive testing!
