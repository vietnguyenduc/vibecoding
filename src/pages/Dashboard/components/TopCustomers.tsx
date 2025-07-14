import React from 'react';
import { useTranslation } from 'react-i18next';
import { Customer } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatting';

interface TopCustomersProps {
  customers: Customer[];
  maxItems?: number;
}

const TopCustomers: React.FC<TopCustomersProps> = ({ 
  customers, 
  maxItems = 10 
}) => {
  const { t } = useTranslation();

  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('dashboard.noCustomers')}</p>
      </div>
    );
  }

  const displayCustomers = customers.slice(0, maxItems);

  return (
    <div className="space-y-3">
      {displayCustomers.map((customer, index) => (
        <div
          key={customer.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {index + 1}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {customer.full_name}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{customer.customer_code}</span>
                {customer.phone && (
                  <>
                    <span>•</span>
                    <span>{customer.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p
              className={`text-sm font-bold ${
                customer.total_balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(customer.total_balance)}
            </p>
            {customer.last_transaction_date && (
              <p className="text-xs text-gray-500">
                {t('dashboard.lastTransaction')}: {formatDate(customer.last_transaction_date)}
              </p>
            )}
          </div>
        </div>
      ))}
      
      {customers.length > maxItems && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            {t('dashboard.showingFirstN', { count: maxItems, total: customers.length })}
          </p>
        </div>
      )}
    </div>
  );
};

export default TopCustomers; 