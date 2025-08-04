import React, { useEffect, useState } from "react";
import DonutChart from "./DonutChart";
import { analyticsRepository } from "../../../../api/repository/admin/analytics.service";
import { FiTrendingUp, FiDollarSign, FiUsers, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AnalysisCard() {
  const [analytics, setAnalytics] = useState({
    subscriptions: 0,
    revenue: 0,
    referrals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartVariant, setChartVariant] = useState("donut");

  const fetchData = () => {
    setLoading(true);
    analyticsRepository.getSummary()
      .then((res) => {
        setAnalytics(res);
      })
      .catch((err) => console.error("Failed to load analytics summary", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = [
    { 
      label: "Active Subscriptions", 
      value: analytics.subscriptions, 
      color: "#3b82f6",
      icon: <FiUsers className="text-blue-500" size={20} />,
      trend: "+12%"
    },
    { 
      label: "Total Revenue", 
      value: analytics.revenue, 
      color: "#10b981",
      icon: <FiDollarSign className="text-emerald-500" size={20} />,
      trend: "+24%"
    },
    { 
      label: "Converted Referrals", 
      value: analytics.referrals, 
      color: "#f59e0b",
      icon: <FiTrendingUp className="text-amber-500" size={20} />,
      trend: "+8%"
    },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-sm p-4 sm:p-6">
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>{/* Title removed as per your request */}</div>
          <button 
            onClick={fetchData}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-xs hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {data.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.label}</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">
                    {item.label.includes("Revenue") ? formatCurrency(item.value) : item.value}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-opacity-10" style={{ backgroundColor: `${item.color}20` }}>
                  {item.icon}
                </div>
              </div>
              <div className="mt-3 flex items-center">
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {item.trend}
                </span>
                <span className="text-xs text-gray-500 ml-2">vs last month</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Chart Card */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                Platform Overview
              </h2>
              <p className="text-gray-600">
                Distribution of key metrics across your platform
              </p>
            </div>
            <div className="flex gap-2 mt-2 lg:mt-0">
              <button 
                onClick={() => setChartVariant("donut")}
                className={`px-3 py-1 text-sm rounded-md ${chartVariant === "donut" ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                Donut
              </button>
              <button 
                onClick={() => setChartVariant("pie")}
                className={`px-3 py-1 text-sm rounded-md ${chartVariant === "pie" ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              >
                Pie
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 flex justify-center">
              {loading ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <DonutChart 
                  data={data} 
                  size={280} 
                  thickness={chartVariant === "donut" ? 40 : 0}
                  cornerRadius={12}
                  padAngle={chartVariant === "pie" ? 0 : 0.02}
                />
              )}
            </div>

            <div className="w-full lg:w-auto space-y-5">
              {data.map((d, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-4 rounded-lg shadow-xs border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: d.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">{d.label}</p>
                      <p className="text-lg font-bold text-gray-800">
                        {d.label.includes("Revenue") ? formatCurrency(d.value) : d.value}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {d.trend}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
