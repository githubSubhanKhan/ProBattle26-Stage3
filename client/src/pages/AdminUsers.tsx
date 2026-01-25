import { useEffect, useState } from "react";
import { getAdminUsers, deleteAdminUser, updateAdminUser } from "../services/adminAPI";

export const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const token = localStorage.getItem("token")!;

  const loadUsers = async () => {
    const data = await getAdminUsers(token);
    setUsers(data.users);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await deleteAdminUser(id, token);
    loadUsers();
  };

  const toggleVerify = async (u: any) => {
    await updateAdminUser(u.id, { is_verified: !u.is_verified }, token);
    loadUsers();
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-orange-100">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t text-center">
              <td>{u.full_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.is_verified ? "✅" : "❌"}</td>

              <td className="space-x-2">
                <button
                  onClick={() => toggleVerify(u)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Toggle Verify
                </button>

                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
