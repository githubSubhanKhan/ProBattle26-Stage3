const baseURL = import.meta.env.VITE_API_BASE_URL;
const BASE = `${baseURL}/api/admin`;

export const getAdminUsers = async (token: string) => {
  const res = await fetch(`${BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getAdminServices = async (token: string) => {
  const res = await fetch(`${BASE}/services`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getAdminStats = async (token: string) => {
  const res = await fetch(`${BASE}/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const deleteAdminUser = async (id: string, token: string) => {
  await fetch(`${baseURL}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateAdminUser = async (id: string, data: any, token: string) => {
  const res = await fetch(`${baseURL}/api/admin/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
};


export const deleteAdminService = async (id: string, token: string) => {
  await fetch(`${baseURL}/api/admin/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
};