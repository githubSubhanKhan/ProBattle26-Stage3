import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminAPI";
import { TrendingUp, Users, Briefcase, Activity } from "lucide-react";

type AdminStatsType = Record<string, number>;

export const AdminStats = () => {
  const [stats, setStats] = useState<AdminStatsType>({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")!;

  useEffect(() => {
    setLoading(true);
    getAdminStats(token).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  // Icon mapping for different stat types
  const getIcon = (key: string) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes("user")) return <Users className="w-8 h-8" />;
    if (keyLower.includes("service")) return <Briefcase className="w-8 h-8" />;
    if (keyLower.includes("active") || keyLower.includes("activity")) return <Activity className="w-8 h-8" />;
    return <TrendingUp className="w-8 h-8" />;
  };

  // Format the key for display
  const formatKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Color mapping for variety
  const getColor = (index: number) => {
    const colors = [
      { bg: "bg-gradient-to-br from-orange-400 to-orange-600", text: "text-white" },
      { bg: "bg-gradient-to-br from-blue-400 to-blue-600", text: "text-white" },
      { bg: "bg-gradient-to-br from-green-400 to-green-600", text: "text-white" },
      { bg: "bg-gradient-to-br from-purple-400 to-purple-600", text: "text-white" },
      { bg: "bg-gradient-to-br from-pink-400 to-pink-600", text: "text-white" },
      { bg: "bg-gradient-to-br from-indigo-400 to-indigo-600", text: "text-white" },
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-[#FFA500] rounded-lg shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time statistics and insights</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFA500] rounded-lg shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 mt-1">Real-time statistics and insights</p>
          </div>
        </div>
        
        {/* Last Updated Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-600">Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Object.entries(stats).map(([k, v], index) => {
          const colorScheme = getColor(index);
          return (
            <div
              key={k}
              className={`${colorScheme.bg} rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-6 relative overflow-hidden group`}
            >
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full -ml-8 -mb-8 group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={`${colorScheme.text} mb-4 opacity-90`}>
                  {getIcon(k)}
                </div>
                
                {/* Label */}
                <h3 className={`text-sm sm:text-base font-semibold ${colorScheme.text} opacity-90 mb-2`}>
                  {formatKey(k)}
                </h3>
                
                {/* Value */}
                <p className={`text-3xl sm:text-4xl font-bold ${colorScheme.text}`}>
                  {v.toLocaleString()}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {Object.keys(stats).length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Statistics Available</h3>
          <p className="text-gray-500">Statistics will appear here once data is available.</p>
        </div>
      )}
    </div>
  );
};