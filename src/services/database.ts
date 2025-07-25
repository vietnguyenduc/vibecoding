// Database Service - Now using real Supabase data
// Import all services from the real implementation
export {
  customerService,
  transactionService,
  bankAccountService,
  branchService,
  dashboardService,
  databaseService
} from './database-real';

// Note: Successfully switched from mock data to real Supabase data
// All components will now use live data from your Supabase database 