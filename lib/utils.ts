import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const base_url = "https://evolve2p-backend.onrender.com";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchUserGrowth = async () => {
  try {
    const res = await fetch(base_url + "/api/admin/overview"); // 🔥 adjust path if different
    const json = await res.json();

    // assuming json.usersGrowth is your array
    const formatted = json.usersGrowth.map((item: any) => ({
      date: `${item.month} ${item.year}`, // "Jan 2025"
      users: item.users,
    }));

    return formatted;
  } catch (err) {
    console.error("Failed to fetch user growth:", err);
  } finally {
  }
};

export const checkToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/check-token", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getOverview = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/overview", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
