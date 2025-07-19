import React from 'react';
import { useTranslation } from 'react-i18next';
import { TimeRange } from '../Dashboard';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: 'day', label: t('dashboard.timeRange.day') },
    { value: 'week', label: t('dashboard.timeRange.week') },
    { value: 'month', label: t('dashboard.timeRange.month') },
    { value: 'quarter', label: t('dashboard.timeRange.quarter') },
    { value: 'year', label: t('dashboard.timeRange.year') },
  ];

  return (
    <div className="flex flex-wrap gap-1 bg-gray-50 rounded-xl p-1 overflow-x-auto shadow-sm border border-gray-100">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap
            ${value === range.value
              ? 'bg-white text-blue-600 shadow-md border border-gray-200 transform scale-105'
              : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50 border border-transparent hover:border-gray-200'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector; 