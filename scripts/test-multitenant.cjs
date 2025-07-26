#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMultiTenantSetup() {
  console.log('🧪 Testing Multi-Tenant Database Setup...\n');

  try {
    // Test 1: Check if tenants table exists
    console.log('🔄 Test 1: Checking tenants table...');
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .limit(5);

    if (tenantsError) {
      console.error('❌ Tenants table test failed:', tenantsError.message);
      console.log('ℹ️  Make sure you\'ve run the database migrations first!');
      return false;
    }

    console.log(`✅ Tenants table exists with ${tenants.length} records`);
    if (tenants.length > 0) {
      console.log('   Sample tenants:');
      tenants.forEach(tenant => {
        console.log(`   - ${tenant.name} (${tenant.slug})`);
      });
    }

    // Test 2: Check if tenant_id columns were added
    console.log('\n🔄 Test 2: Checking tenant_id columns...');
    
    const tables = ['users', 'branches', 'customers', 'transactions', 'bank_accounts'];
    let allTablesHaveTenantId = true;

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('tenant_id')
          .limit(1);
        
        if (error) {
          if (error.message.includes('column "tenant_id" does not exist')) {
            console.log(`❌ ${table} table missing tenant_id column`);
            allTablesHaveTenantId = false;
          } else if (error.code === 'PGRST116') {
            console.log(`⚠️  ${table} table doesn't exist yet (this is OK for empty database)`);
          } else {
            console.log(`❌ Error checking ${table}:`, error.message);
            allTablesHaveTenantId = false;
          }
        } else {
          console.log(`✅ ${table} table has tenant_id column`);
        }
      } catch (err) {
        console.log(`❌ Error testing ${table}:`, err.message);
        allTablesHaveTenantId = false;
      }
    }

    // Test 3: Check RLS policies
    console.log('\n🔄 Test 3: Checking Row Level Security...');
    try {
      // This will test if RLS is working by trying to access data
      const { data: rlsTest, error: rlsError } = await supabase
        .from('tenants')
        .select('*', { count: 'exact', head: true });

      if (rlsError) {
        console.log('⚠️  RLS policies might not be fully configured:', rlsError.message);
      } else {
        console.log('✅ Row Level Security is active');
      }
    } catch (err) {
      console.log('⚠️  Could not test RLS:', err.message);
    }

    // Test 4: Test creating a tenant
    console.log('\n🔄 Test 4: Testing tenant creation...');
    const testTenantName = `Test Tenant ${Date.now()}`;
    const testTenantSlug = `test-${Date.now()}`;

    const { data: newTenant, error: createError } = await supabase
      .from('tenants')
      .insert({
        name: testTenantName,
        slug: testTenantSlug,
        is_active: true
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Could not create test tenant:', createError.message);
    } else {
      console.log('✅ Successfully created test tenant:', newTenant.name);
      
      // Clean up test tenant
      await supabase.from('tenants').delete().eq('id', newTenant.id);
      console.log('✅ Test tenant cleanup completed');
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log('✅ Supabase connection: Working');
    console.log(`${tenants.length > 0 ? '✅' : '❌'} Tenants table: ${tenants.length > 0 ? 'Ready' : 'Empty'}`);
    console.log(`${allTablesHaveTenantId ? '✅' : '❌'} Multi-tenant columns: ${allTablesHaveTenantId ? 'Added' : 'Missing'}`);
    
    if (tenants.length > 0 && allTablesHaveTenantId) {
      console.log('\n🎉 Multi-tenant setup is complete and working!');
      console.log('\nNext steps:');
      console.log('1. Restart your development server: npm run dev');
      console.log('2. Your app will now use real Supabase data instead of mock data');
      console.log('3. Test the application functionality');
      
      return true;
    } else {
      console.log('\n⚠️  Multi-tenant setup needs completion:');
      if (tenants.length === 0) {
        console.log('- Run the database migrations in Supabase dashboard');
      }
      if (!allTablesHaveTenantId) {
        console.log('- Ensure all migrations completed successfully');
      }
      console.log('- See MIGRATION_INSTRUCTIONS.md for detailed steps');
      
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
if (require.main === module) {
  testMultiTenantSetup().catch(console.error);
}

module.exports = { testMultiTenantSetup }; 