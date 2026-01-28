import { useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "../services/adminAPI";
import { Trash2, CheckCircle, XCircle, Search, Users as UsersIcon } from "lucide-react";

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")!;

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAdminUsers(token);
    setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) return;
    await deleteAdminUser(id, token);
    alert(`${userName} has been deleted successfully!`);
    loadUsers();
  };

  const toggleVerify = async (u: any) => {
    await updateAdminUser(u.id, { is_verified: !u.is_verified }, token);
    alert(`${u.full_name} has been ${!u.is_verified ? 'verified' : 'unverified'} successfully!`);
    loadUsers();
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#FFA500] rounded-lg shadow-md">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and monitor all users</p>
          </div>
        </div>
        
        {/* User Count Badge */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Users:</span>
          <span className="text-lg font-bold text-[#FFA500]">{users.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFA500] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFA500]"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600 text-sm">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.is_verified ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleVerify(u)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          {u.is_verified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.full_name)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center items-center gap-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFA500]"></div>
              Loading users...
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-xl shadow-md p-5 space-y-4 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              {/* User Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{u.full_name}</h3>
                    <p className="text-sm text-gray-600 break-all">{u.email}</p>
                  </div>
                  {u.is_verified ? (
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {u.role}
                  </span>
                  {u.is_verified ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => toggleVerify(u)}
                  className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm active:scale-95"
                >
                  {u.is_verified ? 'Unverify' : 'Verify'}
                </button>
                <button
                  onClick={() => handleDelete(u.id, u.full_name)}
                  className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors shadow-sm active:scale-95"
                  title="Delete user"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};