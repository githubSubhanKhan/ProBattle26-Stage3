import { useEffect, useState } from "react";
import { getAdminServices, deleteAdminService } from "../services/adminAPI";

export const AdminServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const token = localStorage.getItem("token")!;

  const loadServices = async () => {
    const data = await getAdminServices(token);
    setServices(data.services);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await deleteAdminService(id, token);
    loadServices();
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <div className="grid grid-cols-3 gap-6">
        {services.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-bold">{s.title}</h3>
            <p>{s.category}</p>
            <p>${s.price}</p>
            <p className="text-sm text-gray-500">By {s.provider}</p>

            <button
              onClick={() => handleDelete(s.id)}
              className="mt-3 w-full bg-red-500 text-white py-1 rounded"
            >
              Delete Service
            </button>
          </div>
        ))}
      </div>
    </>
  );
};
