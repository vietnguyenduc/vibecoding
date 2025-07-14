import { supabase } from './supabase';
import { Customer, Transaction, BankAccount, Branch, User, ImportError } from '../types';
import { RawTransactionData } from '../utils/importUtils';

// Customer Operations
export const customerService = {
  // Get all customers with optional filters
  async getCustomers(filters?: {
    search?: string;
    branch_id?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ data: Customer[]; error: string | null; count: number }> {
    try {
      let query = supabase
        .from('customers')
        .select('*, branch:branches(name)', { count: 'exact' });

      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,customer_code.ilike.%${filters.search}%`);
      }

      if (filters?.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query.order('created_at', { ascending: false });

      return {
        data: data || [],
        error: error?.message || null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0,
      };
    }
  },

  // Get customer by ID
  async getCustomerById(id: string): Promise<{ data: Customer | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, branch:branches(name)')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Create new customer
  async createCustomer(customerData: Partial<Customer>): Promise<{ data: Customer | null; error: string | null }> {
    try {
      // Generate customer code if not provided
      if (!customerData.customer_code) {
        const { data: existingCustomers } = await this.getCustomers({ limit: 1 });
        const lastCustomer = existingCustomers[0];
        const lastCode = lastCustomer?.customer_code || 'CUST0000';
        const nextNumber = parseInt(lastCode.replace('CUST', '')) + 1;
        customerData.customer_code = `CUST${nextNumber.toString().padStart(4, '0')}`;
      }

      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customerData,
          total_balance: 0,
          is_active: true,
        }])
        .select('*, branch:branches(name)')
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Update customer
  async updateCustomer(id: string, updates: Partial<Customer>): Promise<{ data: Customer | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select('*, branch:branches(name)')
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Delete customer (soft delete)
  async deleteCustomer(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('customers')
        .update({ is_active: false })
        .eq('id', id);

      return {
        error: error?.message || null,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Bulk create customers
  async bulkCreateCustomers(customers: Partial<Customer>[]): Promise<{ data: Customer[]; errors: ImportError[] }> {
    const results: Customer[] = [];
    const errors: ImportError[] = [];

    for (let i = 0; i < customers.length; i++) {
      try {
        const result = await this.createCustomer(customers[i]);
        if (result.data) {
          results.push(result.data);
        } else if (result.error) {
          errors.push({
            row: i,
            column: 'general',
            message: result.error,
            value: customers[i],
          });
        }
      } catch (error) {
        errors.push({
          row: i,
          column: 'general',
          message: error instanceof Error ? error.message : 'Unknown error',
          value: customers[i],
        });
      }
    }

    return { data: results, errors };
  },
};

// Transaction Operations
export const transactionService = {
  // Get all transactions with optional filters
  async getTransactions(filters?: {
    customer_id?: string;
    branch_id?: string;
    transaction_type?: string;
    dateRange?: { start: string; end: string };
    limit?: number;
    offset?: number;
  }): Promise<{ data: Transaction[]; error: string | null; count: number }> {
    try {
      let query = supabase
        .from('transactions')
        .select(`
          *,
          customer:customers(full_name, customer_code),
          bank_account:bank_accounts(account_name, account_number),
          branch:branches(name)
        `, { count: 'exact' });

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id);
      }

      if (filters?.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (filters?.transaction_type) {
        query = query.eq('transaction_type', filters.transaction_type);
      }

      if (filters?.dateRange) {
        query = query
          .gte('transaction_date', filters.dateRange.start)
          .lte('transaction_date', filters.dateRange.end);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query.order('transaction_date', { ascending: false });

      return {
        data: data || [],
        error: error?.message || null,
        count: count || 0,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0,
      };
    }
  },

  // Get transaction by ID
  async getTransactionById(id: string): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          customer:customers(full_name, customer_code),
          bank_account:bank_accounts(account_name, account_number),
          branch:branches(name)
        `)
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Create new transaction
  async createTransaction(transactionData: Partial<Transaction>): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      // Generate transaction code if not provided
      if (!transactionData.transaction_code) {
        const { data: existingTransactions } = await this.getTransactions({ limit: 1 });
        const lastTransaction = existingTransactions[0];
        const lastCode = lastTransaction?.transaction_code || 'TXN0000';
        const nextNumber = parseInt(lastCode.replace('TXN', '')) + 1;
        transactionData.transaction_code = `TXN${nextNumber.toString().padStart(4, '0')}`;
      }

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select(`
          *,
          customer:customers(full_name, customer_code),
          bank_account:bank_accounts(account_name, account_number),
          branch:branches(name)
        `)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Update transaction
  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<{ data: Transaction | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          customer:customers(full_name, customer_code),
          bank_account:bank_accounts(account_name, account_number),
          branch:branches(name)
        `)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Delete transaction
  async deleteTransaction(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      return {
        error: error?.message || null,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Bulk import transactions
  async bulkImportTransactions(
    rawData: RawTransactionData[],
    branchId: string,
    createdBy: string
  ): Promise<{ data: Transaction[]; errors: ImportError[] }> {
    const results: Transaction[] = [];
    const errors: ImportError[] = [];

    for (let i = 0; i < rawData.length; i++) {
      try {
        const row = rawData[i];
        
        // Find or create customer
        let customerId = '';
        const { data: existingCustomer } = await customerService.getCustomers({
          search: row.customer_name,
          branch_id: branchId,
          limit: 1,
        });

        if (existingCustomer.length > 0) {
          customerId = existingCustomer[0].id;
        } else {
          // Create new customer
          const { data: newCustomer, error: customerError } = await customerService.createCustomer({
            full_name: row.customer_name,
            branch_id: branchId,
          });

          if (newCustomer) {
            customerId = newCustomer.id;
          } else {
            errors.push({
              row: i,
              column: 'customer_name',
              message: customerError || 'Failed to create customer',
              value: row.customer_name,
            });
            continue;
          }
        }

        // Find bank account
        const { data: bankAccounts } = await bankAccountService.getBankAccounts({
          branch_id: branchId,
          search: row.bank_account,
        });

        if (bankAccounts.length === 0) {
          errors.push({
            row: i,
            column: 'bank_account',
            message: 'Bank account not found',
            value: row.bank_account,
          });
          continue;
        }

        const bankAccountId = bankAccounts[0].id;

        // Create transaction
        const { data: transaction, error: transactionError } = await this.createTransaction({
          customer_id: customerId,
          bank_account_id: bankAccountId,
          branch_id: branchId,
          transaction_type: row.transaction_type.toLowerCase().trim() as any,
          amount: parseFloat(row.amount.replace(/[$,€£¥₫\s]/g, '')),
          description: row.description || '',
          reference_number: row.reference_number || '',
          transaction_date: new Date(row.transaction_date).toISOString(),
          created_by: createdBy,
        });

        if (transaction) {
          results.push(transaction);
        } else if (transactionError) {
          errors.push({
            row: i,
            column: 'general',
            message: transactionError,
            value: row,
          });
        }
      } catch (error) {
        errors.push({
          row: i,
          column: 'general',
          message: error instanceof Error ? error.message : 'Unknown error',
          value: rawData[i],
        });
      }
    }

    return { data: results, errors };
  },
};

// Bank Account Operations
export const bankAccountService = {
  // Get all bank accounts with optional filters
  async getBankAccounts(filters?: {
    branch_id?: string;
    search?: string;
    is_active?: boolean;
  }): Promise<{ data: BankAccount[]; error: string | null }> {
    try {
      let query = supabase
        .from('bank_accounts')
        .select('*, branch:branches(name)');

      if (filters?.branch_id) {
        query = query.eq('branch_id', filters.branch_id);
      }

      if (filters?.search) {
        query = query.or(`account_name.ilike.%${filters.search}%,account_number.ilike.%${filters.search}%`);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      const { data, error } = await query.order('account_name');

      return {
        data: data || [],
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get bank account by ID
  async getBankAccountById(id: string): Promise<{ data: BankAccount | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*, branch:branches(name)')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

// Branch Operations
export const branchService = {
  // Get all branches
  async getBranches(): Promise<{ data: Branch[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true)
        .order('name');

      return {
        data: data || [],
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Get branch by ID
  async getBranchById(id: string): Promise<{ data: Branch | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('id', id)
        .single();

      return {
        data: data || null,
        error: error?.message || null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};

// Dashboard Operations
export const dashboardService = {
  // Get dashboard metrics
  async getDashboardMetrics(branchId?: string): Promise<{
    data: {
      totalOutstanding: number;
      totalOutstandingChange: number;
      activeCustomers: number;
      activeCustomersChange: number;
      monthlyTransactions: number;
      monthlyTransactionsChange: number;
      totalTransactions: number;
      totalTransactionsChange: number;
      balanceByBranch: Array<{ branch_id: string; branch_name: string; balance: number }>;
      balanceByBankAccount: Array<{
        bank_account_id: string;
        account_name: string;
        account_number: string;
        balance: number;
      }>;
      cashFlowData: Array<{
        date: string;
        inflow: number;
        outflow: number;
        netFlow: number;
      }>;
      recentTransactions: Transaction[];
      topCustomers: Customer[];
    } | null;
    error: string | null;
  }> {
    try {
      // Get total outstanding balance
      const { data: customers } = await customerService.getCustomers({
        branch_id: branchId,
        is_active: true,
      });
      const totalOutstanding = customers.reduce((sum, customer) => sum + customer.total_balance, 0);

      // Get active customers count
      const activeCustomers = customers.length;

      // Get monthly transactions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyTransactions } = await transactionService.getTransactions({
        branch_id: branchId,
        dateRange: {
          start: startOfMonth.toISOString(),
          end: new Date().toISOString(),
        },
      });

      // Get total transactions
      const { data: allTransactions } = await transactionService.getTransactions({
        branch_id: branchId,
      });

      // Get recent transactions
      const { data: recentTransactions } = await transactionService.getTransactions({
        branch_id: branchId,
        limit: 10,
      });

      // Get top customers
      const topCustomers = customers
        .sort((a, b) => Math.abs(b.total_balance) - Math.abs(a.total_balance))
        .slice(0, 10);

      // Get balance by branch
      const { data: branches } = await branchService.getBranches();
      const balanceByBranch = await Promise.all(
        branches.map(async (branch) => {
          const { data: branchCustomers } = await customerService.getCustomers({
            branch_id: branch.id,
            is_active: true,
          });
          const balance = branchCustomers.reduce((sum, customer) => sum + customer.total_balance, 0);
          return {
            branch_id: branch.id,
            branch_name: branch.name,
            balance,
          };
        })
      );

      // Get balance by bank account
      const { data: bankAccounts } = await bankAccountService.getBankAccounts({
        branch_id: branchId,
        is_active: true,
      });

      // Generate sample cash flow data (in a real app, this would come from actual transaction data)
      const cashFlowData = this.generateCashFlowData();

      // Calculate changes (simplified - in a real app, compare with previous period)
      const totalOutstandingChange = 0; // Would calculate from previous period
      const activeCustomersChange = 0;
      const monthlyTransactionsChange = 0;
      const totalTransactionsChange = 0;

      return {
        data: {
          totalOutstanding,
          totalOutstandingChange,
          activeCustomers,
          activeCustomersChange,
          monthlyTransactions: monthlyTransactions.length,
          monthlyTransactionsChange,
          totalTransactions: allTransactions.length,
          totalTransactionsChange,
          balanceByBranch,
          balanceByBankAccount: bankAccounts.map(account => ({
            bank_account_id: account.id,
            account_name: account.account_name,
            account_number: account.account_number,
            balance: account.balance,
          })),
          cashFlowData,
          recentTransactions,
          topCustomers,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },

  // Generate sample cash flow data
  generateCashFlowData(): Array<{
    date: string;
    inflow: number;
    outflow: number;
    netFlow: number;
  }> {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const inflow = Math.random() * 50000 + 10000;
      const outflow = Math.random() * 30000 + 5000;
      const netFlow = inflow - outflow;
      
      data.push({
        date: date.toISOString().split('T')[0],
        inflow,
        outflow,
        netFlow,
      });
    }
    
    return data;
  },
};

// Export all services
export const databaseService = {
  customers: customerService,
  transactions: transactionService,
  bankAccounts: bankAccountService,
  branches: branchService,
  dashboard: dashboardService,
}; 