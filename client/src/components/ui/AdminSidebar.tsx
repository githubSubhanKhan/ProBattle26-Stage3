import { NavLink } from "react-router-dom";

export const AdminSidebar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-[#FFA500] text-white shadow"
        : "text-gray-700 hover:bg-[#FFA500] hover:text-white"
    }`;

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-6 flex flex-col">
      {/* Title */}
      <h2
        className="text-2xl font-bold mb-8 text-center"
        style={{ color: "#FFA500" }}
      >
        Admin Panel
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
        <NavLink to="/admin/stats" className={linkClass}>
          <span className="mr-2">📊</span> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <span className="mr-2">👥</span> Users
        </NavLink>
        <NavLink to="/admin/services" className={linkClass}>
          <span className="mr-2">🛠</span> Services
        </NavLink>
      </nav>

      {/* Optional: logout button or footer */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        <button
          className="w-full py-2 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
