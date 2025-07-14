import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../utils/formatting';

interface BalanceByBranch {
  branch_id: string;
  branch_name: string;
  balance: number;
}

interface BalanceBreakdownProps {
  data: BalanceByBranch[];
}

const BalanceBreakdown: React.FC<BalanceBreakdownProps> = ({ data }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('dashboard.noBranchData')}</p>
      </div>
    );
  }

  const totalBalance = data.reduce((sum, branch) => sum + branch.balance, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((branch) => {
          const percentage = totalBalance !== 0 ? (branch.balance / totalBalance) * 100 : 0;
          const isPositive = branch.balance >= 0;

          return (
            <div
              key={branch.branch_id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {branch.branch_name}
                </h4>
                <span className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-bold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {formatCurrency(branch.balance)}
                </span>
                
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isPositive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(Math.abs(percentage), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {t('dashboard.totalBalance')}
          </span>
          <span
            className={`text-lg font-bold ${
              totalBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {formatCurrency(totalBalance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BalanceBreakdown; 