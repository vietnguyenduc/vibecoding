const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySupabaseData() {
  console.log('🔍 Verifying Supabase Data...');
  console.log('='.repeat(50));

  try {
    // Check tenants
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', '550e8400-e29b-41d4-a716-446655440001');

    // Check customers  
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .eq('tenant_id', '550e8400-e29b-41d4-a716-446655440001');

    // Check transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('tenant_id', '550e8400-e29b-41d4-a716-446655440001');

    console.log('📊 Results:');
    console.log(`   🏢 Tenants: ${tenants?.length || 0}`);
    console.log(`   👥 Customers: ${customers?.length || 0}`);
    console.log(`   💰 Transactions: ${transactions?.length || 0}`);

    if (tenants?.length > 0 && customers?.length > 0) {
      console.log('\n✅ Vietnamese mock data found in Supabase!');
      console.log('Your app should now show real data when you sign in.');
    } else {
      console.log('\n❌ No Vietnamese mock data found.');
      console.log('Please run the migration in Supabase Dashboard first.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifySupabaseData(); 