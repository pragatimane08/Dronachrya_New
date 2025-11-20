import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Gift, RefreshCw, Calendar, TrendingDown, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { analyticsRepository } from "../../../../api/repository/admin/analytics.service";

const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPieChart, setShowPieChart] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const summaryData = await analyticsRepository.getSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor, gradient, trend, subtitle }) => (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group`}>
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`${color} p-3 rounded-xl bg-opacity-10 ${gradient.replace('to-', 'from-').replace('from-', 'to-')}`}>
            <Icon className="w-7 h-7" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider">{title}</h3>
        <p className={`text-4xl font-bold ${color} mb-2`}>{value}</p>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-indigo-600">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-xl w-80 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-white rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-white rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Base Revenue', value: summary?.baseRevenue || 0, color: '#10b981' },
    { name: 'Tax Collected', value: summary?.taxCollected || 0, color: '#8b5cf6' }
  ];

  const barData = [
    { name: 'Base Revenue', value: summary?.baseRevenue || 0, color: '#10b981' },
    { name: 'Tax Collected', value: summary?.taxCollected || 0, color: '#8b5cf6' },
    { name: 'Gross Revenue', value: summary?.grossRevenue || 0, color: '#3b82f6' }
  ];

  const taxPercentage = summary?.taxCollected > 0
    ? ((summary.taxCollected / summary.baseRevenue) * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Real-time insights and performance metrics</p>
          </div> */}
          <div className="flex gap-3">
            <button
              onClick={loadAllData}
              className="bg-white text-gray-700 px-5 py-2 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Subscriptions"
            value={formatNumber(summary?.subscriptions)}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-white"
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            trend={12.5}
            subtitle="Total active users"
          />

          <StatCard
            title="Base Revenue"
            value={formatCurrency(summary?.baseRevenue)}
            icon={DollarSign}
            color="text-green-600"
            bgColor="bg-white"
            gradient="bg-gradient-to-br from-green-400 to-emerald-600"
            trend={8.2}
            subtitle="Revenue before tax"
          />

          <StatCard
            title="Tax Collected"
            value={formatCurrency(summary?.taxCollected)}
            icon={TrendingUp}
            color="text-purple-600"
            bgColor="bg-white"
            gradient="bg-gradient-to-br from-purple-400 to-purple-600"
            subtitle={`${taxPercentage}% GST`}
          />

          <StatCard
            title="Gross Revenue"
            value={formatCurrency(summary?.grossRevenue)}
            icon={Gift}
            color="text-purple-600"
            bgColor="bg-white"
            gradient="bg-gradient-to-br from-purple-400 to-purple-600"
            trend={15.3}
            subtitle="Total collected revenue"
          />
        </div>

        {/* Revenue Visualization Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Revenue Breakdown</h3>
                <p className="text-sm text-gray-500">Detailed revenue analysis</p>
              </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setShowPieChart(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${showPieChart
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <PieChartIcon className="w-4 h-4" />
                Pie Chart
              </button>
              <button
                onClick={() => setShowPieChart(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${!showPieChart
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <BarChart3 className="w-4 h-4" />
                Bar Chart
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              {showPieChart ? (
                <div>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={130}
                        paddingAngle={5}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                        labelLine={true}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Revenue distribution between base amount and tax
                  </p>
                </div>
              ) : (
                <div>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.6} />
                        </linearGradient>
                        <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="value"
                        radius={[12, 12, 0, 0]}
                        maxBarSize={100}
                      >
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#barGradient${index + 1})`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Comparative view of base revenue, tax collected, and gross revenue
                  </p>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-green-700 text-sm font-semibold uppercase tracking-wider">Base Revenue</p>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(summary?.baseRevenue)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-green-200">
                  <span className="text-xs text-green-600">Pre-tax earnings</span>
                  <span className="text-xs font-semibold text-green-700">
                    {((summary?.baseRevenue / summary?.grossRevenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-purple-700 text-sm font-semibold uppercase tracking-wider">Tax Amount</p>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(summary?.taxCollected)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                  <span className="text-xs text-purple-600">GST collected</span>
                  <span className="text-xs font-semibold text-purple-700">{taxPercentage}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-blue-700 text-sm font-semibold uppercase tracking-wider">Gross Revenue</p>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(summary?.grossRevenue)}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                  <span className="text-xs text-blue-600">Total collected</span>
                  <span className="text-xs font-semibold text-blue-700">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;