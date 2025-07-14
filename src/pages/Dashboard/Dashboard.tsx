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
      const result = await databaseService.dashboard.getDashboardMetrics(user.branch_id);
      
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
  }, [user?.branch_id]);

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('dashboard.title')}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {t('dashboard.subtitle')}
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0">
              <TimeRangeSelector 
                value={timeRange}
                onChange={setTimeRange}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            title={t('dashboard.monthlyTransactions')}
            value={metrics.monthlyTransactions.toString()}
            change={metrics.monthlyTransactionsChange}
            changeType={metrics.monthlyTransactionsChange >= 0 ? 'increase' : 'decrease'}
            icon="chart"
            color="warning"
          />
          
          <MetricsCard
            title={t('dashboard.totalTransactions')}
            value={metrics.totalTransactions.toString()}
            change={metrics.totalTransactionsChange}
            changeType={metrics.totalTransactionsChange >= 0 ? 'increase' : 'decrease'}
            icon="database"
            color="info"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Balance by Bank Account Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.balanceByBank')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('dashboard.balanceByBankDescription')}
              </p>
            </div>
            <div className="p-6">
              <BalanceByBankChart data={metrics.balanceByBankAccount} />
            </div>
          </div>

          {/* Cash Flow Chart */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.cashFlow')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('dashboard.cashFlowDescription')}
              </p>
            </div>
            <div className="p-6">
              <CashFlowChart data={metrics.cashFlowData} timeRange={timeRange} />
            </div>
          </div>
        </div>

        {/* Balance Breakdown by Branch */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('dashboard.balanceByBranch')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('dashboard.balanceByBranchDescription')}
            </p>
          </div>
          <div className="p-6">
            <BalanceBreakdown data={metrics.balanceByBranch} />
          </div>
        </div>

        {/* Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.recentTransactions')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('dashboard.recentTransactionsDescription')}
              </p>
            </div>
            <div className="p-6">
              <RecentTransactions 
                transactions={metrics.recentTransactions}
                maxItems={10}
              />
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {t('dashboard.topCustomers')}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('dashboard.topCustomersDescription')}
              </p>
            </div>
            <div className="p-6">
              <TopCustomers 
                customers={metrics.topCustomers}
                maxItems={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 