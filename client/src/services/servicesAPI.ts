const baseURL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${baseURL}/api/services`;
const AUTH_URL = `${baseURL}/api/auth`;

export interface AddServicePayload {
  title: string;
  description?: string;
  category: string;
  price: number;
  price_type?: "HOURLY" | "FIXED";
}

export const addService = async (
  service: AddServicePayload,
  token: string
) => {
  const res = await fetch(BASE_URL + "/add-service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(service)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to add service");
  }

  return data;
};

export const searchNearbyServices = async (
  lat: number,
  lng: number,
  radiusKm = 10
) => {
  const res = await fetch(
    `${BASE_URL}/search-nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Search failed");
  return data.services;
};

export const searchServicesByLocation = async (
  latitude: number,
  longitude: number,
  radiusKm: number = 10
) => {
  const response = await fetch(
    `${BASE_URL}/search-nearby?lat=${latitude}&lng=${longitude}&radiusKm=${radiusKm}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Search failed");
  return data.services;
};

export const getServices = async (token?: string) => {
  const headers: {
    "Content-Type": string;
    Authorization?: string;
  } = {
    "Content-Type": "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(BASE_URL, {
    method: "GET",
    headers
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch services");
  }

  return data.services;
};

export const updateUserLocation = async (
  latitude: number,
  longitude: number,
  token: string
) => {
  const res = await fetch(`${AUTH_URL}/update-location`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ latitude, longitude })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update location");
  }

  return data;
};