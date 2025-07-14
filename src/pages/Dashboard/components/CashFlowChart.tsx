import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../../utils/formatting';
import { TimeRange } from '../Dashboard';

interface CashFlowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
  timeRange: TimeRange;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, timeRange }) => {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t('dashboard.noCashFlowData')}</p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const inflow = payload.find((p: any) => p.dataKey === 'inflow')?.value || 0;
      const outflow = payload.find((p: any) => p.dataKey === 'outflow')?.value || 0;
      const netFlow = payload.find((p: any) => p.dataKey === 'netFlow')?.value || 0;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-xs text-green-600">
              {t('dashboard.inflow')}: {formatCurrency(inflow)}
            </p>
            <p className="text-xs text-red-600">
              {t('dashboard.outflow')}: {formatCurrency(outflow)}
            </p>
            <p
              className={`text-sm font-bold ${
                netFlow >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {t('dashboard.netFlow')}: {formatCurrency(netFlow)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format date based on time range
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (timeRange) {
      case 'day':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case 'week':
        return date.toLocaleDateString([], { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
      case 'quarter':
        return date.toLocaleDateString([], { month: 'short' });
      case 'year':
        return date.toLocaleDateString([], { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={formatDate}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Inflow Area */}
          <Area
            type="monotone"
            dataKey="inflow"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name={t('dashboard.inflow')}
          />
          
          {/* Outflow Area (negative values) */}
          <Area
            type="monotone"
            dataKey="outflow"
            stackId="1"
            stroke="#EF4444"
            fill="#EF4444"
            fillOpacity={0.6}
            name={t('dashboard.outflow')}
          />
          
          {/* Net Flow Line */}
          <Area
            type="monotone"
            dataKey="netFlow"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="none"
            name={t('dashboard.netFlow')}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart; 