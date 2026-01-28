import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Wrench, LogOut, X } from "lucide-react";

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#FFA500] text-white shadow-md"
        : "text-gray-700 hover:bg-[#FFA500] hover:text-white hover:shadow-sm"
    }`;

  const handleNavClick = () => {
    // Close sidebar on mobile when clicking nav items
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 h-screen bg-white shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#FFA500]">
            Admin Panel
          </h2>
          {/* Close X button - ONLY VISIBLE ON MOBILE */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/admin/stats"
          className={linkClass}
          onClick={handleNavClick}
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={linkClass}
          onClick={handleNavClick}
        >
          <Users className="w-5 h-5 mr-3" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/services"
          className={linkClass}
          onClick={handleNavClick}
        >
          <Wrench className="w-5 h-5 mr-3" />
          <span>Services</span>
        </NavLink>
      </nav>

      {/* Footer with Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm hover:shadow-md"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};