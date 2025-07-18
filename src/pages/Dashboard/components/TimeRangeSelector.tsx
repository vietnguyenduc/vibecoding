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
    <div className="flex flex-wrap gap-2 bg-gray-100 rounded-lg p-1 overflow-x-auto">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors whitespace-nowrap
            ${value === range.value
              ? 'bg-blue-600 text-white border-blue-600 shadow'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-blue-50 hover:border-blue-400'}
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector; 