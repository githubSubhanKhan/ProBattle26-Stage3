import { useEffect, useState } from "react";
import { getAdminServices, deleteAdminService } from "../services/adminAPI";
import { Trash2, Search, Wrench, DollarSign, Tag, User } from "lucide-react";

export const AdminServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")!;

  const loadServices = async () => {
    setLoading(true);
    const data = await getAdminServices(token);
    setServices(data.services);
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    await deleteAdminService(id, token);
    alert(`"${title}" has been deleted successfully!`);
    loadServices();
  };

  const filteredServices = services.filter(
    (s) =>
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.provider?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFA500] rounded-lg shadow-md">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Services Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and monitor all services</p>
          </div>
        </div>
        
        {/* Services Count Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Services:</span>
          <span className="text-lg font-bold text-[#FFA500]">{services.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, category or provider..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Services Found</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search criteria" : "No services available at the moment"}
          </p>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] p-4">
                <h3 className="font-bold text-lg text-white truncate group-hover:text-clip">
                  {s.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                {/* Category */}
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Category</p>
                    <p className="text-sm font-semibold">{s.category}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Price</p>
                    <p className="text-sm font-semibold text-green-600">${s.price}</p>
                  </div>
                </div>

                {/* Provider */}
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-medium">Provider</p>
                    <p className="text-sm font-semibold truncate">{s.provider}</p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(s.id, s.title)}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors shadow-sm hover:shadow-md active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Service
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};