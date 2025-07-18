import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { databaseService } from '../../services/database';
import { formatCurrency } from '../../utils/formatting';
import { LoadingFallback, ErrorFallback } from '../../components/UI/FallbackUI';
import {
  MetricsCard,
  BalanceBreakdown,
  BalanceByBankChart,
  CashFlowChart,
  RecentTransactions,
  TopCustomers,
  TimeRangeSelector,
} from './components';

export type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user?.branch_id) return;

    setLoading(true);
    setError(null);

    try {
      const result = await databaseService.dashboard.getDashboardMetrics(user.branch_id, timeRange);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setMetrics(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [user?.branch_id, timeRange]);

  // Load data on component mount and when time range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData, timeRange]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 w-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <LoadingFallback 
            title={t('dashboard.loading')}
            message={t('dashboard.loadingData')}
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 w-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <ErrorFallback 
            title={t('dashboard.error')}
            message={error}
            retry={fetchDashboardData}
          />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 w-full">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              {t('dashboard.noData')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('dashboard.noDataDescription')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 w-full">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.title')}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {t('dashboard.subtitle')}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <TimeRangeSelector 
                value={timeRange}
                onChange={setTimeRange}
              />
            </div>
          </div>
        </div>
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 w-full">
          <MetricsCard
            title={t('dashboard.totalOutstanding')}
            value={formatCurrency(metrics.totalOutstanding)}
            change={metrics.totalOutstandingChange}
            changeType={metrics.totalOutstandingChange >= 0 ? 'increase' : 'decrease'}
            icon="currency"
            color="primary"
          />
          <MetricsCard
            title={t('dashboard.activeCustomers')}
            value={metrics.activeCustomers.toString()}
            change={metrics.activeCustomersChange}
            changeType={metrics.activeCustomersChange >= 0 ? 'increase' : 'decrease'}
            icon="users"
            color="success"
          />
          <MetricsCard
            title={t('dashboard.transactionsInPeriod', { period: t(`dashboard.timeRange.${timeRange}`) })}
            value={metrics.transactionsInPeriod.toString()}
            change={metrics.transactionsInPeriodChange}
            changeType={metrics.transactionsInPeriodChange >= 0 ? 'increase' : 'decrease'}
            icon="chart"
            color="warning"
          />
          <MetricsCard
            title={t('dashboard.transactionAmountsInPeriod', { period: t(`dashboard.timeRange.${timeRange}`) })}
            value=""
            icon="currency"
            color="info"
            dualValues={{
              income: formatCurrency(metrics.transactionIncomeInPeriod),
              debt: formatCurrency(metrics.transactionDebtInPeriod),
              incomeChange: metrics.transactionIncomeChange,
              debtChange: metrics.transactionDebtChange
            }}
          />
        </div>
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full">
          {/* Balance by Bank Account Chart */}
          <div className="bg-white rounded-lg shadow w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">
                {t('dashboard.balanceByBank')}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {t('dashboard.balanceByBankDescription')}
              </p>
            </div>
            <div className="p-4">
              <BalanceByBankChart data={metrics.balanceByBankAccount} />
            </div>
          </div>
          {/* Cash Flow Chart */}
          <div className="bg-white rounded-lg shadow w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">
                {t('dashboard.cashFlow')}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {t('dashboard.cashFlowDescription')}
              </p>
            </div>
            <div className="p-4">
              <CashFlowChart data={metrics.cashFlowData} timeRange={timeRange} />
            </div>
          </div>
        </div>
        {/* Balance Breakdown by Branch */}
        <div className="bg-white rounded-lg shadow mb-4 w-full">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-900">
              {t('dashboard.balanceByBranch')}
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              {t('dashboard.balanceByBranchDescription')}
            </p>
          </div>
          <div className="p-4">
            <BalanceBreakdown data={metrics.transactionAmountsByBranch} />
          </div>
        </div>
        {/* Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">
                {t('dashboard.recentTransactions')}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {t('dashboard.recentTransactionsDescription')}
              </p>
            </div>
            <div className="p-4">
              <RecentTransactions 
                transactions={metrics.recentTransactions}
                maxItems={8}
              />
            </div>
          </div>
          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow w-full">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">
                {t('dashboard.topCustomers')}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {t('dashboard.topCustomersDescription')}
              </p>
            </div>
            <div className="p-4">
              <TopCustomers 
                customers={metrics.topCustomers}
                maxItems={8}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 