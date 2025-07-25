import { supabase } from './supabase';
import { Customer, Transaction } from '../types';

// Real database services using Supabase
export const customerService = {
  async getCustomers(filters: any = {}) {
    try {
      let query = supabase
        .from('customers')
        .select('*');

      if (filters.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }
      
      if (typeof filters.is_active === 'boolean') {
        query = query.eq('is_active', filters.is_active);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching customers:', error);
        return { data: [], error: error.message, count: 0 };
      }

      return { data: data || [], error: null, count: data?.length || 0 };
    } catch (error) {
      console.error('Customer service error:', error);
      return { data: [], error: 'Failed to fetch customers', count: 0 };
    }
  },

  async getCustomerById(id: string) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch customer' };
    }
  },

  async createCustomer(customerData: Partial<Customer>) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customerData)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create customer' };
    }
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update customer' };
    }
  },

  async deleteCustomer(id: string) {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Failed to delete customer' };
    }
  },

  async bulkCreateCustomers(customers: Partial<Customer>[]) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert(customers)
        .select();

      if (error) {
        return { data: [], errors: [error.message] };
      }

      return { data: data || [], errors: [] };
    } catch (error) {
      return { data: [], errors: ['Failed to bulk create customers'] };
    }
  }
};

export const transactionService = {
  async getTransactions(filters: any = {}) {
    try {
      let query = supabase
        .from('transactions')
        .select('*');

      if (filters.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }
      
      if (filters.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (filters.start_date) {
        query = query.gte('transaction_date', filters.start_date);
      }

      if (filters.end_date) {
        query = query.lte('transaction_date', filters.end_date);
      }

      query = query.order('transaction_date', { ascending: false });

      const { data, error } = await query;

      if (error) {
        return { data: [], error: error.message, count: 0 };
      }

      return { data: data || [], error: null, count: data?.length || 0 };
    } catch (error) {
      return { data: [], error: 'Failed to fetch transactions', count: 0 };
    }
  },

  async getTransactionById(id: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch transaction' };
    }
  },

  async createTransaction(transactionData: Partial<Transaction>) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create transaction' };
    }
  },

  async updateTransaction(id: string, updates: Partial<Transaction>) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update transaction' };
    }
  },

  async deleteTransaction(id: string) {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      return { error: error?.message || null };
    } catch (error) {
      return { error: 'Failed to delete transaction' };
    }
  },

  async bulkImportTransactions(rawData: any[], branchId?: string, createdBy?: string) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(rawData.map(item => ({
          ...item,
          branch_id: branchId,
          created_by: createdBy
        })))
        .select();

      if (error) {
        return { data: [], errors: [error.message] };
      }

      return { data: data || [], errors: [] };
    } catch (error) {
      return { data: [], errors: ['Failed to bulk import transactions'] };
    }
  }
};

export const bankAccountService = {
  async getBankAccounts(filters: any = {}) {
    try {
      let query = supabase.from('bank_accounts').select('*');

      if (filters.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (typeof filters.is_active === 'boolean') {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query;

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: 'Failed to fetch bank accounts' };
    }
  },

  async getBankAccountById(id: string) {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch bank account' };
    }
  }
};

export const branchService = {
  async getBranches() {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        return { data: [], error: error.message };
      }

      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: 'Failed to fetch branches' };
    }
  },

  async getBranchById(id: string) {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch branch' };
    }
  }
};

export const dashboardService = {
  async getDashboardMetrics(_branchId?: string, _timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
    try {
      // Basic implementation - you can enhance this with more complex queries
      const { data: customers } = await supabase.from('customers').select('total_balance').eq('is_active', true);
      const { data: transactions } = await supabase.from('transactions').select('amount, transaction_type').limit(100);

      const totalOutstanding = customers?.reduce((sum, c) => sum + (c.total_balance || 0), 0) || 0;
      const transactionCount = transactions?.length || 0;
      const activeCustomers = customers?.length || 0;
      
      // Calculate payment and charge counts
      const paymentTransactions = transactions?.filter(t => t.transaction_type === 'payment') || [];
      const chargeTransactions = transactions?.filter(t => t.transaction_type === 'charge') || [];
      const transactionPaymentCount = paymentTransactions.length;
      const transactionChargeCount = chargeTransactions.length;

      return {
        data: {
          totalOutstanding,
          totalOutstandingChange: 0,
          activeCustomers,
          activeCustomersChange: 0,
          transactionsInPeriod: transactionCount,
          transactionsInPeriodChange: 0,
          transactionAmountsInPeriod: transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
          transactionAmountsInPeriodChange: 0,
          transactionIncomeInPeriod: paymentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          transactionDebtInPeriod: chargeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
          transactionIncomeChange: 0,
          transactionDebtChange: 0,
          transactionPaymentCount,
          transactionChargeCount,
          transactionPaymentChange: 0,
          transactionChargeChange: 0,
          totalTransactions: transactionCount,
          totalTransactionsChange: 0,
          transactionAmountsByBranch: [],
          balanceByBankAccount: [],
          cashFlowData: [
            {
              date: new Date().toISOString().split('T')[0],
              inflow: paymentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
              outflow: chargeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
              netFlow: paymentTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) - chargeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
            }
          ],
          recentTransactions: transactions?.slice(0, 10) || [],
          topCustomers: customers?.sort((a, b) => (b.total_balance || 0) - (a.total_balance || 0)).slice(0, 10) || [],
        },
        error: null
      };
    } catch (error) {
      console.error('Dashboard service error:', error);
      return { data: null, error: 'Failed to fetch dashboard metrics' };
    }
  }
};

export const databaseService = {
  customers: customerService,
  transactions: transactionService,
  bankAccounts: bankAccountService,
  branches: branchService,
  dashboard: dashboardService,
}; 