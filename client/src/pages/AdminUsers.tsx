import { useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "../services/adminAPI";
import { Trash2, CheckCircle, XCircle, Search, Users as UsersIcon } from "lucide-react";

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 NEW STATES (minimal & necessary)
  const [confirmAction, setConfirmAction] = useState<{
    type: "delete" | "verify" | "unverify";
    userId: string;
    userName: string;
  } | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

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

  // 🔹 SINGLE CONFIRMED ACTION HANDLER
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    try {
      setActionLoading(true);

      if (confirmAction.type === "delete") {
        await deleteAdminUser(confirmAction.userId, token);
        setMessage({
          type: "success",
          text: `${confirmAction.userName} has been deleted successfully.`,
        });
      }

      if (confirmAction.type === "verify") {
        await updateAdminUser(confirmAction.userId, { is_verified: true }, token);
        setMessage({
          type: "success",
          text: `${confirmAction.userName} has been verified successfully.`,
        });
      }

      if (confirmAction.type === "unverify") {
        await updateAdminUser(confirmAction.userId, { is_verified: false }, token);
        setMessage({
          type: "success",
          text: `${confirmAction.userName} has been unverified successfully.`,
        });
      }

      loadUsers();
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* ✅ MESSAGE BOX */}
      {message && (
        <div
          className={`rounded-lg px-4 py-3 font-medium shadow-md
            ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
        >
          {message.text}
        </div>
      )}

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
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <span className="text-sm font-medium text-gray-600">Total Users:</span>
          <span className="text-lg font-bold text-[#FFA500]">{users.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FFA500]"
          />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#FFA500] to-[#FF8C00] text-white">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{u.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                <td className="px-6 py-4">{u.role}</td>
                <td className="px-6 py-4 text-center">
                  {u.is_verified ? "Verified" : "Unverified"}
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: u.is_verified ? "unverify" : "verify",
                        userId: u.id,
                        userName: u.full_name,
                      })
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {u.is_verified ? "Unverify" : "Verify"}
                  </button>

                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "delete",
                        userId: u.id,
                        userName: u.full_name,
                      })
                    }
                    className="p-2 bg-red-500 text-white rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ CONFIRMATION MODAL */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              {confirmAction.type === "delete"
                ? "Delete User"
                : confirmAction.type === "verify"
                ? "Verify User"
                : "Unverify User"}
            </h2>

            <p className="text-gray-600">
              Are you sure you want to <strong>{confirmAction.type}</strong>{" "}
              <strong>{confirmAction.userName}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={actionLoading}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {actionLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
