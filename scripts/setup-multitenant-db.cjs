#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(migrationFile) {
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationFile}`);
    return false;
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    console.log(`🔄 Running migration: ${migrationFile}`);
    
    // Split SQL by statements and execute them one by one
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.error(`❌ Error in statement: ${statement.substring(0, 100)}...`);
          console.error(error);
          return false;
        }
      }
    }
    
    console.log(`✅ Migration completed: ${migrationFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error running migration ${migrationFile}:`, error);
    return false;
  }
}

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is expected
      console.error('❌ Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

async function setupMultiTenantDatabase() {
  console.log('🚀 Setting up Multi-Tenant Database...\n');

  // Test connection first
  const connectionOk = await testConnection();
  if (!connectionOk) {
    process.exit(1);
  }

  // Check if we have the exec_sql function (needed for migrations)
  console.log('🔄 Checking database permissions...');
  const { data, error } = await supabase.rpc('exec_sql', { 
    sql_query: 'SELECT current_user, current_database();' 
  });
  
  if (error) {
    console.log('⚠️  Note: Using alternative migration approach...');
    console.log('ℹ️  You may need to run the SQL migrations manually in your Supabase dashboard.');
    console.log('\nMigration files to run in order:');
    console.log('1. supabase/migrations/005_add_multi_tenancy.sql');
    console.log('2. supabase/migrations/006_update_rls_for_tenancy.sql');
    console.log('3. supabase/migrations/007_tenant_seed_data.sql');
    
    // Try to create basic structure using available APIs
    await setupBasicStructure();
    return;
  }

  console.log('✅ Database permissions OK');

  // Run migrations in order
  const migrations = [
    '005_add_multi_tenancy.sql',
    '006_update_rls_for_tenancy.sql', 
    '007_tenant_seed_data.sql'
  ];

  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (!success) {
      console.error(`❌ Failed to run migration: ${migration}`);
      process.exit(1);
    }
  }

  console.log('\n🎉 Multi-tenant database setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Create your first tenant');
  console.log('2. Update your application to use real database');
  console.log('3. Test the multi-tenant functionality');
}

async function setupBasicStructure() {
  console.log('🔄 Setting up basic tenant structure...');
  
  try {
    // Create a sample tenant using the available API
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name: 'Demo Company',
        slug: 'demo-company',
        domain: 'demo.example.com',
        is_active: true
      })
      .select()
      .single();

    if (tenantError && !tenantError.message.includes('already exists')) {
      console.log('ℹ️  Could not create sample tenant via API. This might mean the tenant table doesn\'t exist yet.');
      console.log('   Please run the migrations manually in your Supabase dashboard.');
    } else if (tenant) {
      console.log('✅ Sample tenant created:', tenant.name);
    }

  } catch (error) {
    console.log('ℹ️  Basic structure setup requires manual migration execution.');
  }
}

async function createFirstTenant() {
  console.log('\n🔄 Creating your first tenant...');
  
  const { data, error } = await supabase
    .from('tenants')
    .insert({
      name: 'Your Company',
      slug: 'your-company',
      domain: 'yourcompany.com',
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating tenant:', error);
    return null;
  }

  console.log('✅ First tenant created successfully!');
  console.log('   Name:', data.name);
  console.log('   Slug:', data.slug);
  console.log('   ID:', data.id);
  
  return data;
}

// Run the setup
if (require.main === module) {
  setupMultiTenantDatabase().catch(console.error);
}

module.exports = { setupMultiTenantDatabase, createFirstTenant }; 