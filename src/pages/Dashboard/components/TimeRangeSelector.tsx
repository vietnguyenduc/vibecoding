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
    <div className="flex bg-gray-100 rounded-lg p-1">
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            value === range.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector; 