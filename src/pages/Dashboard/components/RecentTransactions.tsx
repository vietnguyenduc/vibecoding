import React from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatting';

interface RecentTransactionsProps {
  transactions: Transaction[];
  maxItems?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  maxItems = 10 
}) => {
  const { t } = useTranslation();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('dashboard.noTransactions')}</p>
      </div>
    );
  }

  const displayTransactions = transactions.slice(0, maxItems);

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'charge':
        return 'text-red-600 bg-red-100';
      case 'adjustment':
        return 'text-yellow-600 bg-yellow-100';
      case 'refund':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return t('transactions.types.payment');
      case 'charge':
        return t('transactions.types.charge');
      case 'adjustment':
        return t('transactions.types.adjustment');
      case 'refund':
        return t('transactions.types.refund');
      default:
        return type;
    }
  };

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(
                    transaction.transaction_type
                  )}`}
                >
                  {getTransactionTypeLabel(transaction.transaction_type)}
                </span>
              </div>
              
                             <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-gray-900 truncate">
                   {t('dashboard.customerId', { id: transaction.customer_id })}
                 </p>
                 <p className="text-xs text-gray-500">
                   {t('dashboard.accountId', { id: transaction.bank_account_id })}
                 </p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDate(transaction.transaction_date)}
              </p>
            </div>
            
            {transaction.description && (
              <div className="hidden sm:block">
                <p className="text-xs text-gray-500 max-w-32 truncate" title={transaction.description}>
                  {transaction.description}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {transactions.length > maxItems && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            {t('dashboard.showingFirstN', { count: maxItems, total: transactions.length })}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions; 