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

export const getUsers = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/users", {
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

export const getUser = async (userId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/user/" + userId, {
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

export const performUserAction = async (actionType: string, userId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/perform-action-user", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        actionType,
        userId,
      }),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getTrades = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-trades", {
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

export const getTransactions = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-transactions", {
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

export const getSwaps = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-swaps", {
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

export const getPaymentMethods = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-payment-methods", {
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

export const createPaymentMethod = async (name: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/create-payment-method", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const deletePaymentMethod = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(
      base_url + "/api/admin/delete-payment-method/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const deleteOffer = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/delete-offer/" + id, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const performOfferAction = async (
  actionType: string,
  offerId: string
) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/perform-offer-action", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        actionType,
        offerId,
      }),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getOffers = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-offers", {
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

export const getOffer = async (offerId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-offer/" + offerId, {
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

export const getDisputes = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-disputes", {
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

export const getDispute = async (disputeId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/get-dispute/" + disputeId, {
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

export const resolveDispute = async (
  disputeId: string,
  winner: "BUYER" | "SELLER"
) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(
      base_url + "/api/admin/resolve-dispute/" + disputeId,
      {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          winner,
        }),
      }
    );

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const sendChat = async (chatId: string, content: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await fetch(base_url + "/api/admin/send-chat", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        chatId,
        content,
      }),
    });

    return res.json();
  } catch (error) {
    console.log(error);
  }
};
