import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface KPICard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPICard[]>([]);
  const [salesData, setSalesData] = useState<ChartData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Mock KPI data - replace with real API calls
    const mockKPIs: KPICard[] = [
      {
        title: 'Total Revenue',
        value: '$156,420',
        change: 12.5,
        trend: 'up',
        icon: <CurrencyDollarIcon className="h-6 w-6" />,
        color: 'text-green-600'
      },
      {
        title: 'Prescriptions Filled',
        value: 1247,
        change: 8.2,
        trend: 'up',
        icon: <ChartBarIcon className="h-6 w-6" />,
        color: 'text-blue-600'
      },
      {
        title: 'Active Customers',
        value: 892,
        change: -2.1,
        trend: 'down',
        icon: <UserGroupIcon className="h-6 w-6" />,
        color: 'text-purple-600'
      },
      {
        title: 'Avg Processing Time',
        value: '4.2 min',
        change: -15.3,
        trend: 'up',
        icon: <ClockIcon className="h-6 w-6" />,
        color: 'text-yellow-600'
      },
      {
        title: 'Inventory Alerts',
        value: 23,
        change: 5.7,
        trend: 'down',
        icon: <ExclamationTriangleIcon className="h-6 w-6" />,
        color: 'text-red-600'
      },
      {
        title: 'Customer Satisfaction',
        value: '94.8%',
        change: 2.3,
        trend: 'up',
        icon: <ArrowTrendingUpIcon className="h-6 w-6" />,
        color: 'text-indigo-600'
      }
    ];
    
    setKpis(mockKPIs);

    // Mock sales data
    const mockSalesData: ChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sales ($)',
          data: [12400, 19300, 15200, 17800, 22100, 18600, 20900],
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 1)'
        }
      ]
    };
    
    setSalesData(mockSalesData);
  }, [timeRange]);

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your pharmacy's performance and key metrics</p>
        </div>
        
        {/* Time Range Selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full bg-gray-100 ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div className={`flex items-center space-x-1 ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <ArrowTrendingUpIcon className={`h-4 w-4 ${
                  kpi.trend === 'down' ? 'transform rotate-180' : ''
                }`} />
                <span className="text-sm font-medium">
                  {Math.abs(kpi.change)}%
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">{kpi.value}</h3>
              <p className="text-sm text-gray-600">{kpi.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Chart visualization would go here</p>
              <p className="text-xs text-gray-400">Integrate with Chart.js or Recharts</p>
            </div>
          </div>
        </motion.div>

        {/* Top Medications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Medications</h3>
          <div className="space-y-4">
            {[
              { name: 'Ibuprofen 400mg', sales: 156, revenue: '$3,120' },
              { name: 'Paracetamol 500mg', sales: 142, revenue: '$2,840' },
              { name: 'Aspirin 75mg', sales: 98, revenue: '$1,960' },
              { name: 'Omeprazole 20mg', sales: 87, revenue: '$2,610' },
              { name: 'Metformin 500mg', sales: 76, revenue: '$2,280' }
            ].map((med, index) => (
              <div key={med.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-500">{med.sales} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{med.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Prescription filled', details: 'John Doe - Metformin 500mg', time: '2 minutes ago', type: 'success' },
            { action: 'Low stock alert', details: 'Ibuprofen 400mg - 5 units remaining', time: '15 minutes ago', type: 'warning' },
            { action: 'New customer registered', details: 'Sarah Johnson', time: '1 hour ago', type: 'info' },
            { action: 'Payment processed', details: '$45.50 for prescription #12847', time: '2 hours ago', type: 'success' },
            { action: 'Inventory updated', details: 'Aspirin 75mg - 100 units added', time: '3 hours ago', type: 'info' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${
                activity.type === 'success' ? 'bg-green-500' :
                activity.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;