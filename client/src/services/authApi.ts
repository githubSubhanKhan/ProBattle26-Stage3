const baseURL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${baseURL}/api/auth`;

type UserRole = "SEEKER" | "PROVIDER";

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
};

export const signupUser = async (
  full_name: string,
  email: string,
  password: string,
  role: UserRole
  
) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ full_name, email, password, role }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
};