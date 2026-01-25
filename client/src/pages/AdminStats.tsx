import { useEffect, useState } from "react";
import { getAdminStats } from "../services/adminAPI";

export const AdminStats = () => {
  const [stats, setStats] = useState<any>({});
  const token = localStorage.getItem("token")!;

  useEffect(() => {
    getAdminStats(token).then(setStats);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-6">
      {Object.entries(stats).map(([k, v]) => (
        <div key={k} className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold">{k}</h3>
          <p className="text-3xl" style={{ color: "#FFA500" }}>{v as string | number}</p>
        </div>
      ))}
    </div>
  );
};


