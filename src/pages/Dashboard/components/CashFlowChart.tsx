import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

  // Transform data for waterfall chart
  const waterfallData = data.map((item, index) => {
    const total = Math.abs(item.inflow) + Math.abs(item.outflow);
    const inflowPercentage = total > 0 ? (Math.abs(item.inflow) / total) * 100 : 0;
    const outflowPercentage = total > 0 ? (Math.abs(item.outflow) / total) * 100 : 0;
    
    return [
      {
        name: `${item.date}_inflow`,
        value: item.inflow,
        percentage: inflowPercentage,
        type: 'inflow',
        date: item.date,
        fill: '#10B981',
        stroke: '#059669',
      },
      {
        name: `${item.date}_outflow`,
        value: -Math.abs(item.outflow), // Negative for outflow
        percentage: outflowPercentage,
        type: 'outflow',
        date: item.date,
        fill: '#EF4444',
        stroke: '#DC2626',
      }
    ];
  }).flat();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {formatDate(data.date)} - {data.type === 'inflow' ? t('dashboard.inflow') : t('dashboard.outflow')}
          </p>
          <div className="space-y-1 mt-2">
            <p className={`text-sm font-bold ${data.type === 'inflow' ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(data.value))}
            </p>
            <p className="text-xs text-gray-600">
              {data.percentage.toFixed(1)}% {t('dashboard.ofTotal')}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom bar with labels
  const CustomBar = (props: any) => {
    const { x, y, width, height, value, percentage, type } = props;
    const isPositive = value >= 0;
    const absValue = Math.abs(value);
    
    return (
      <g>
        {/* Bar */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={type === 'inflow' ? '#10B981' : '#EF4444'}
          stroke={type === 'inflow' ? '#059669' : '#DC2626'}
          strokeWidth={1}
        />
        
        {/* Amount label inside bar */}
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium fill-white"
          style={{ fontSize: '10px', fontWeight: '500' }}
        >
          {formatCurrency(absValue)}
        </text>
        
        {/* Percentage label outside bar */}
        <text
          x={x + width / 2}
          y={isPositive ? y - 8 : y + height + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs text-gray-600"
          style={{ fontSize: '10px' }}
        >
          {percentage.toFixed(1)}%
        </text>
      </g>
    );
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
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={waterfallData} 
          margin={{ top: 40, right: 30, left: 20, bottom: 60 }}
          barGap={0}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = value.split('_')[0];
              const type = value.split('_')[1];
              return `${formatDate(date)} ${type === 'inflow' ? '↑' : '↓'}`;
            }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(Math.abs(value))}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Bar
            dataKey="value"
            shape={<CustomBar />}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart; 