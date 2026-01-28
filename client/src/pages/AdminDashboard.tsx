import { AdminSidebar } from "../components/ui/AdminSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#F8FFE5] to-[#E8F5E9]">
      {/* Mobile Header - ONLY VISIBLE ON SMALL SCREENS */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          {/* HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Dark Overlay - ONLY VISIBLE ON MOBILE WHEN SIDEBAR IS OPEN */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          /* MOBILE: Hidden by default, slides in when open */
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          /* DESKTOP: Always visible */
          lg:translate-x-0 
          transition-transform duration-300 ease-in-out
        `}
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        <div className="pt-16 lg:pt-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};