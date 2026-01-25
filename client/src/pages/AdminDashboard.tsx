import { AdminSidebar } from "../components/ui/AdminSidebar";
import { Outlet } from "react-router-dom";

export const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FFE5]">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};
