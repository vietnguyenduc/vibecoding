// REMOVE all original Supabase-based service exports above this line
// Only export the mocked services below for testing

export const customerService = {
  async getCustomers(_filters?: any) {
    return {
      data: [
        {
          id: '1',
          customer_code: 'CUST0001',
          full_name: 'Test Customer',
          phone: '0123456789',
          email: 'test@customer.com',
          address: '123 Main St',
          branch_id: '1',
          total_balance: 1000,
          last_transaction_date: '2024-01-01T00:00:00Z',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
      count: 1,
    };
  },
  async getCustomerById(_id: string) {
    return {
      data: {
        id: '1',
        customer_code: 'CUST0001',
        full_name: 'Test Customer',
        phone: '0123456789',
        email: 'test@customer.com',
        address: '123 Main St',
        branch_id: '1',
        total_balance: 1000,
        last_transaction_date: '2024-01-01T00:00:00Z',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    };
  },
  async createCustomer(_customerData?: any) { return { data: null, error: null }; },
  async updateCustomer(_id: string, _updates?: any) { return { data: null, error: null }; },
  async deleteCustomer(_id: string) { return { error: null }; },
  async bulkCreateCustomers(_customers?: any[]) { return { data: [], errors: [] }; },
};

export const transactionService = {
  async getTransactions(_filters?: any) {
    return {
      data: [
        {
          id: '1',
          transaction_code: 'TXN0001',
          customer_id: '1',
          bank_account_id: '1',
          branch_id: '1',
          transaction_type: 'payment' as const,
          amount: 500,
          description: 'Test payment',
          reference_number: 'REF123',
          transaction_date: '2024-01-01T00:00:00Z',
          created_by: 'test-user',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
      count: 1,
    };
  },
  async getTransactionById(_id: string) {
    return {
      data: {
        id: '1',
        transaction_code: 'TXN0001',
        customer_id: '1',
        bank_account_id: '1',
        branch_id: '1',
        transaction_type: 'payment' as const,
        amount: 500,
        description: 'Test payment',
        reference_number: 'REF123',
        transaction_date: '2024-01-01T00:00:00Z',
        created_by: 'test-user',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    };
  },
  async createTransaction(_transactionData?: any) { return { data: null, error: null }; },
  async updateTransaction(_id: string, _updates?: any) { return { data: null, error: null }; },
  async deleteTransaction(_id: string) { return { error: null }; },
  async bulkImportTransactions(_rawData?: any[], _branchId?: string, _createdBy?: string) { return { data: [], errors: [] }; },
};

export const bankAccountService = {
  async getBankAccounts(_filters?: any) {
    return {
      data: [
        {
          id: '1',
          account_number: '123456',
          account_name: 'Test Bank',
          bank_name: 'Test Bank',
          branch_id: '1',
          balance: 1000,
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
    };
  },
  async getBankAccountById(_id: string) {
    return {
      data: {
        id: '1',
        account_number: '123456',
        account_name: 'Test Bank',
        bank_name: 'Test Bank',
        branch_id: '1',
        balance: 1000,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    };
  },
};

export const branchService = {
  async getBranches() {
    return {
      data: [
        {
          id: '1',
          name: 'Main Branch',
          code: 'MB001',
          address: '123 Main St',
          phone: '0123456789',
          email: 'main@branch.com',
          manager_id: 'test-user',
          is_active: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ],
      error: null,
    };
  },
  async getBranchById(_id: string) {
    return {
      data: {
        id: '1',
        name: 'Main Branch',
        code: 'MB001',
        address: '123 Main St',
        phone: '0123456789',
        email: 'main@branch.com',
        manager_id: 'test-user',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      error: null,
    };
  },
};

export const dashboardService = {
  async getDashboardMetrics(_branchId?: string, timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
    // Mock different transaction counts based on time range
    const transactionCounts = {
      day: 5,
      week: 25,
      month: 100,
      quarter: 300,
      year: 1200
    };

    // Mock previous period transaction counts (same period last time)
    const previousTransactionCounts = {
      day: 3,      // 3 giao dịch ngày hôm trước
      week: 20,    // 20 giao dịch tuần trước
      month: 85,   // 85 giao dịch tháng trước
      quarter: 250, // 250 giao dịch quý trước
      year: 1000   // 1000 giao dịch năm trước
    };

    // Calculate changes based on previous period
    const transactionChanges = {
      day: transactionCounts.day - previousTransactionCounts.day,
      week: transactionCounts.week - previousTransactionCounts.week,
      month: transactionCounts.month - previousTransactionCounts.month,
      quarter: transactionCounts.quarter - previousTransactionCounts.quarter,
      year: transactionCounts.year - previousTransactionCounts.year
    };

    // Mock different transaction amounts based on time range (in VND)
    const transactionAmounts = {
      day: 7500000,      // 7.5 triệu VND (2 + 5.5)
      week: 37500000,    // 37.5 triệu VND (10 + 27.5)
      month: 150000000,  // 150 triệu VND (40 + 110)
      quarter: 450000000, // 450 triệu VND (120 + 330)
      year: 1800000000   // 1.8 tỷ VND (480 + 1320)
    };

    // Mock income amounts (tiền thu được)
    const incomeAmounts = {
      day: 2000000,      // 2 triệu VND thu
      week: 10000000,    // 10 triệu VND thu
      month: 40000000,   // 40 triệu VND thu
      quarter: 120000000, // 120 triệu VND thu
      year: 480000000    // 480 triệu VND thu
    };

    // Mock debt amounts (tiền cho nợ)
    const debtAmounts = {
      day: 5500000,      // 5.5 triệu VND cho nợ
      week: 27500000,    // 27.5 triệu VND cho nợ
      month: 110000000,  // 110 triệu VND cho nợ
      quarter: 330000000, // 330 triệu VND cho nợ
      year: 1320000000   // 1.32 tỷ VND cho nợ
    };

    // Mock previous period transaction amounts
    const previousTransactionAmounts = {
      day: 4500000,      // 4.5 triệu VND ngày hôm trước (1.2 + 3.3)
      week: 22500000,    // 22.5 triệu VND tuần trước (6 + 16.5)
      month: 90000000,   // 90 triệu VND tháng trước (24 + 66)
      quarter: 270000000, // 270 triệu VND quý trước (72 + 198)
      year: 1080000000   // 1.08 tỷ VND năm trước (288 + 792)
    };

    // Mock previous period income amounts
    const previousIncomeAmounts = {
      day: 1200000,      // 1.2 triệu VND thu ngày hôm trước
      week: 6000000,     // 6 triệu VND thu tuần trước
      month: 24000000,   // 24 triệu VND thu tháng trước
      quarter: 72000000, // 72 triệu VND thu quý trước
      year: 288000000    // 288 triệu VND thu năm trước
    };

    // Mock previous period debt amounts
    const previousDebtAmounts = {
      day: 3300000,      // 3.3 triệu VND cho nợ ngày hôm trước
      week: 16500000,    // 16.5 triệu VND cho nợ tuần trước
      month: 66000000,   // 66 triệu VND cho nợ tháng trước
      quarter: 198000000, // 198 triệu VND cho nợ quý trước
      year: 792000000    // 792 triệu VND cho nợ năm trước
    };

    // Calculate amount changes based on previous period
    const transactionAmountChanges = {
      day: transactionAmounts.day - previousTransactionAmounts.day,
      week: transactionAmounts.week - previousTransactionAmounts.week,
      month: transactionAmounts.month - previousTransactionAmounts.month,
      quarter: transactionAmounts.quarter - previousTransactionAmounts.quarter,
      year: transactionAmounts.year - previousTransactionAmounts.year
    };

    // Calculate income changes based on previous period
    const incomeChanges = {
      day: incomeAmounts.day - previousIncomeAmounts.day,
      week: incomeAmounts.week - previousIncomeAmounts.week,
      month: incomeAmounts.month - previousIncomeAmounts.month,
      quarter: incomeAmounts.quarter - previousIncomeAmounts.quarter,
      year: incomeAmounts.year - previousIncomeAmounts.year
    };

    // Calculate debt changes based on previous period
    const debtChanges = {
      day: debtAmounts.day - previousDebtAmounts.day,
      week: debtAmounts.week - previousDebtAmounts.week,
      month: debtAmounts.month - previousDebtAmounts.month,
      quarter: debtAmounts.quarter - previousDebtAmounts.quarter,
      year: debtAmounts.year - previousDebtAmounts.year
    };

    // Mock outstanding balance by time range
    const outstandingBalances = {
      day: 1000,
      week: 1200,
      month: 1500,
      quarter: 2000,
      year: 2500
    };

    // Mock previous period outstanding balances
    const previousOutstandingBalances = {
      day: 950,   // 950 VND ngày hôm trước
      week: 1100, // 1100 VND tuần trước
      month: 1400, // 1400 VND tháng trước
      quarter: 1800, // 1800 VND quý trước
      year: 2200   // 2200 VND năm trước
    };

    // Calculate outstanding changes based on previous period
    const outstandingChanges = {
      day: outstandingBalances.day - previousOutstandingBalances.day,
      week: outstandingBalances.week - previousOutstandingBalances.week,
      month: outstandingBalances.month - previousOutstandingBalances.month,
      quarter: outstandingBalances.quarter - previousOutstandingBalances.quarter,
      year: outstandingBalances.year - previousOutstandingBalances.year
    };

    // Mock active customers by time range
    const activeCustomers = {
      day: 1,
      week: 2,
      month: 3,
      quarter: 4,
      year: 5
    };

    // Mock previous period active customers
    const previousActiveCustomers = {
      day: 1,   // Giữ nguyên
      week: 1,  // Tăng 1
      month: 2, // Tăng 1
      quarter: 3, // Tăng 1
      year: 4   // Tăng 1
    };

    // Calculate active customers changes based on previous period
    const activeCustomersChanges = {
      day: activeCustomers.day - previousActiveCustomers.day,
      week: activeCustomers.week - previousActiveCustomers.week,
      month: activeCustomers.month - previousActiveCustomers.month,
      quarter: activeCustomers.quarter - previousActiveCustomers.quarter,
      year: activeCustomers.year - previousActiveCustomers.year
    };

    // Mock transaction amounts by branch based on time range
    const transactionAmountsByBranchData = {
      day: [
        { 
          branch_id: '1', 
          branch_name: 'Chi nhánh Hà Nội', 
          incomeAmount: 800000,   // 0.8 triệu VND thu
          debtAmount: 2200000     // 2.2 triệu VND cho nợ
        },
        { 
          branch_id: '2', 
          branch_name: 'Chi nhánh TP.HCM', 
          incomeAmount: 1000000,  // 1 triệu VND thu
          debtAmount: 2500000     // 2.5 triệu VND cho nợ
        },
        { 
          branch_id: '3', 
          branch_name: 'Chi nhánh Đà Nẵng', 
          incomeAmount: 200000,   // 0.2 triệu VND thu
          debtAmount: 800000      // 0.8 triệu VND cho nợ
        }
      ],
      week: [
        { 
          branch_id: '1', 
          branch_name: 'Chi nhánh Hà Nội', 
          incomeAmount: 4000000,  // 4 triệu VND thu
          debtAmount: 11000000    // 11 triệu VND cho nợ
        },
        { 
          branch_id: '2', 
          branch_name: 'Chi nhánh TP.HCM', 
          incomeAmount: 5000000,  // 5 triệu VND thu
          debtAmount: 12500000    // 12.5 triệu VND cho nợ
        },
        { 
          branch_id: '3', 
          branch_name: 'Chi nhánh Đà Nẵng', 
          incomeAmount: 1000000,  // 1 triệu VND thu
          debtAmount: 4000000     // 4 triệu VND cho nợ
        }
      ],
      month: [
        { 
          branch_id: '1', 
          branch_name: 'Chi nhánh Hà Nội', 
          incomeAmount: 16000000, // 16 triệu VND thu
          debtAmount: 44000000    // 44 triệu VND cho nợ
        },
        { 
          branch_id: '2', 
          branch_name: 'Chi nhánh TP.HCM', 
          incomeAmount: 20000000, // 20 triệu VND thu
          debtAmount: 50000000    // 50 triệu VND cho nợ
        },
        { 
          branch_id: '3', 
          branch_name: 'Chi nhánh Đà Nẵng', 
          incomeAmount: 4000000,  // 4 triệu VND thu
          debtAmount: 16000000    // 16 triệu VND cho nợ
        }
      ],
      quarter: [
        { 
          branch_id: '1', 
          branch_name: 'Chi nhánh Hà Nội', 
          incomeAmount: 48000000, // 48 triệu VND thu
          debtAmount: 132000000   // 132 triệu VND cho nợ
        },
        { 
          branch_id: '2', 
          branch_name: 'Chi nhánh TP.HCM', 
          incomeAmount: 60000000, // 60 triệu VND thu
          debtAmount: 150000000   // 150 triệu VND cho nợ
        },
        { 
          branch_id: '3', 
          branch_name: 'Chi nhánh Đà Nẵng', 
          incomeAmount: 12000000, // 12 triệu VND thu
          debtAmount: 48000000    // 48 triệu VND cho nợ
        }
      ],
      year: [
        { 
          branch_id: '1', 
          branch_name: 'Chi nhánh Hà Nội', 
          incomeAmount: 192000000, // 192 triệu VND thu
          debtAmount: 528000000    // 528 triệu VND cho nợ
        },
        { 
          branch_id: '2', 
          branch_name: 'Chi nhánh TP.HCM', 
          incomeAmount: 240000000, // 240 triệu VND thu
          debtAmount: 600000000    // 600 triệu VND cho nợ
        },
        { 
          branch_id: '3', 
          branch_name: 'Chi nhánh Đà Nẵng', 
          incomeAmount: 48000000,  // 48 triệu VND thu
          debtAmount: 192000000    // 192 triệu VND cho nợ
        }
      ]
    };

    // Verify sum matches transactionAmountsInPeriod
    const branchIncomeSum = transactionAmountsByBranchData[timeRange].reduce((sum, branch) => sum + branch.incomeAmount, 0);
    const branchDebtSum = transactionAmountsByBranchData[timeRange].reduce((sum, branch) => sum + branch.debtAmount, 0);
    const branchTotalSum = branchIncomeSum + branchDebtSum;
    
    console.log(`Branch income sum for ${timeRange}: ${branchIncomeSum}, Income amount: ${incomeAmounts[timeRange]}`);
    console.log(`Branch debt sum for ${timeRange}: ${branchDebtSum}, Debt amount: ${debtAmounts[timeRange]}`);
    console.log(`Branch total sum for ${timeRange}: ${branchTotalSum}, Transaction amount: ${transactionAmounts[timeRange]}`);
    
    // Ensure the sums match exactly
    if (branchIncomeSum !== incomeAmounts[timeRange]) {
      console.warn(`Income sum mismatch for ${timeRange}: branch sum = ${branchIncomeSum}, income amount = ${incomeAmounts[timeRange]}`);
    }
    if (branchDebtSum !== debtAmounts[timeRange]) {
      console.warn(`Debt sum mismatch for ${timeRange}: branch sum = ${branchDebtSum}, debt amount = ${debtAmounts[timeRange]}`);
    }
    if (branchTotalSum !== transactionAmounts[timeRange]) {
      console.warn(`Total sum mismatch for ${timeRange}: branch sum = ${branchTotalSum}, transaction amount = ${transactionAmounts[timeRange]}`);
    }

    return {
      data: {
        totalOutstanding: outstandingBalances[timeRange],
        totalOutstandingChange: outstandingChanges[timeRange],
        activeCustomers: activeCustomers[timeRange],
        activeCustomersChange: activeCustomersChanges[timeRange],
        transactionsInPeriod: transactionCounts[timeRange],
        transactionsInPeriodChange: transactionChanges[timeRange],
        transactionAmountsInPeriod: transactionAmounts[timeRange],
        transactionAmountsInPeriodChange: transactionAmountChanges[timeRange],
        transactionIncomeInPeriod: incomeAmounts[timeRange],
        transactionDebtInPeriod: debtAmounts[timeRange],
        transactionIncomeChange: incomeChanges[timeRange],
        transactionDebtChange: debtChanges[timeRange],
        totalTransactions: 1,
        totalTransactionsChange: 0,
        transactionAmountsByBranch: transactionAmountsByBranchData[timeRange],
        balanceByBankAccount: [{ bank_account_id: '1', account_name: 'Test Bank', account_number: '123456', balance: 1000 }],
        cashFlowData: (() => {
          const baseData = {
            day: [
              { date: '2024-01-01T08:00:00Z', inflow: 2500000, outflow: 800000, netFlow: 1700000 },
              { date: '2024-01-01T10:00:00Z', inflow: 1800000, outflow: 3200000, netFlow: -1400000 },
              { date: '2024-01-01T12:00:00Z', inflow: 4200000, outflow: 1500000, netFlow: 2700000 },
              { date: '2024-01-01T14:00:00Z', inflow: 1200000, outflow: 2800000, netFlow: -1600000 },
              { date: '2024-01-01T16:00:00Z', inflow: 3500000, outflow: 1200000, netFlow: 2300000 },
              { date: '2024-01-01T18:00:00Z', inflow: 900000, outflow: 2500000, netFlow: -1600000 },
              { date: '2024-01-01T20:00:00Z', inflow: 2800000, outflow: 1800000, netFlow: 1000000 },
            ],
            week: [
              { date: '2024-01-01T00:00:00Z', inflow: 12000000, outflow: 5000000, netFlow: 7000000 },
              { date: '2024-01-02T00:00:00Z', inflow: 8000000, outflow: 15000000, netFlow: -7000000 },
              { date: '2024-01-03T00:00:00Z', inflow: 18000000, outflow: 8000000, netFlow: 10000000 },
              { date: '2024-01-04T00:00:00Z', inflow: 6000000, outflow: 12000000, netFlow: -6000000 },
              { date: '2024-01-05T00:00:00Z', inflow: 15000000, outflow: 7000000, netFlow: 8000000 },
              { date: '2024-01-06T00:00:00Z', inflow: 9000000, outflow: 14000000, netFlow: -5000000 },
              { date: '2024-01-07T00:00:00Z', inflow: 11000000, outflow: 6000000, netFlow: 5000000 },
            ],
            month: [
              { date: '2024-01-01T00:00:00Z', inflow: 45000000, outflow: 20000000, netFlow: 25000000 },
              { date: '2024-01-08T00:00:00Z', inflow: 30000000, outflow: 50000000, netFlow: -20000000 },
              { date: '2024-01-15T00:00:00Z', inflow: 60000000, outflow: 25000000, netFlow: 35000000 },
              { date: '2024-01-22T00:00:00Z', inflow: 20000000, outflow: 45000000, netFlow: -25000000 },
              { date: '2024-01-29T00:00:00Z', inflow: 55000000, outflow: 30000000, netFlow: 25000000 },
            ],
            quarter: [
              { date: '2024-01-01T00:00:00Z', inflow: 140000000, outflow: 60000000, netFlow: 80000000 },
              { date: '2024-02-01T00:00:00Z', inflow: 90000000, outflow: 150000000, netFlow: -60000000 },
              { date: '2024-03-01T00:00:00Z', inflow: 180000000, outflow: 80000000, netFlow: 100000000 },
            ],
            year: [
              { date: '2024-01-01T00:00:00Z', inflow: 560000000, outflow: 240000000, netFlow: 320000000 },
              { date: '2024-04-01T00:00:00Z', inflow: 360000000, outflow: 600000000, netFlow: -240000000 },
              { date: '2024-07-01T00:00:00Z', inflow: 720000000, outflow: 320000000, netFlow: 400000000 },
              { date: '2024-10-01T00:00:00Z', inflow: 240000000, outflow: 480000000, netFlow: -240000000 },
            ]
          };
          return baseData[timeRange] || baseData.month;
        })(),
        recentTransactions: [
          {
            id: '1',
            transaction_code: 'TXN0001',
            customer_id: '1',
            bank_account_id: '1',
            branch_id: '1',
            transaction_type: 'payment' as const,
            amount: 500,
            description: 'Test payment',
            reference_number: 'REF123',
            transaction_date: '2024-01-01T00:00:00Z',
            created_by: 'test-user',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
        topCustomers: [
          {
            id: '1',
            customer_code: 'CUST0001',
            full_name: 'Test Customer',
            phone: '0123456789',
            email: 'test@customer.com',
            address: '123 Main St',
            branch_id: '1',
            total_balance: 1000,
            last_transaction_date: '2024-01-01T00:00:00Z',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
      error: null,
    };
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