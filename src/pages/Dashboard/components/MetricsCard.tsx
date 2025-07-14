import React from 'react';
import { formatCurrency } from '../../../utils/formatting';

interface MetricsCardProps {
  title: string;
  value: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: 'currency' | 'users' | 'chart' | 'database';
  color: 'primary' | 'success' | 'warning' | 'info';
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  color,
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'currency':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-blue-50',
          icon: 'text-blue-600',
          value: 'text-blue-900',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          icon: 'text-green-600',
          value: 'text-green-900',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          value: 'text-yellow-900',
        };
      case 'info':
        return {
          bg: 'bg-indigo-50',
          icon: 'text-indigo-600',
          value: 'text-indigo-900',
        };
      default:
        return {
          bg: 'bg-gray-50',
          icon: 'text-gray-600',
          value: 'text-gray-900',
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`${colorClasses.bg} rounded-lg p-6`}>
      <div className="flex items-center">
        <div className={`${colorClasses.icon} p-2 rounded-md bg-white`}>
          {getIcon()}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${colorClasses.value}`}>{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {changeType === 'increase' ? '+' : ''}
                {typeof change === 'number' && change.toString().includes('.')
                  ? formatCurrency(change)
                  : change}
              </span>
              <svg
                className={`ml-1 w-4 h-4 ${
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {changeType === 'increase' ? (
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard; 