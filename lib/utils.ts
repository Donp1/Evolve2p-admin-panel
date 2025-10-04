import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export const base_url = "https://evolve2p-backend.onrender.com";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

async function safeFetch(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000 // 10s timeout
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    return res.json();
  } catch (err: any) {
    console.log(err?.message || err);
    if (err.name === "AbortError") {
      toast.error("Request timed out. Please check your connection.");
    } else {
      toast.error("Network error. Please (reload) and try again.");
    }
  } finally {
    clearTimeout(id);
  }
}

export const checkToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/check-token", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOverview = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  console.log(token);

  try {
    const res = await safeFetch(base_url + "/api/admin/overview", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/users", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (userId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/user/" + userId, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const performUserAction = async (actionType: string, userId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/perform-action-user", {
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

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const resetUserPassword = async (password: string, userId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  console.log(password, userId);

  try {
    const res = await safeFetch(base_url + "/api/admin/reset-user-password", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        password,
        userId,
      }),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTrades = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-trades", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-transactions", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSwaps = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-swaps", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentMethods = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-payment-methods", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createPaymentMethod = async (name: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/create-payment-method", {
      method: "POST",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deletePaymentMethod = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(
      base_url + "/api/admin/delete-payment-method/" + id,
      {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOffer = async (id: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/delete-offer/" + id, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
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
    const res = await safeFetch(base_url + "/api/admin/perform-offer-action", {
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

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOffers = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-offers", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getOffer = async (offerId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-offer/" + offerId, {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getDisputes = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/get-disputes", {
      method: "GET",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getDispute = async (disputeId: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(
      base_url + "/api/admin/get-dispute/" + disputeId,
      {
        method: "GET",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    return res;
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
    const res = await safeFetch(
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

    return res;
  } catch (error) {
    console.log(error);
  }
};

export const sendChat = async (chatId: string, content: string) => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  try {
    const res = await safeFetch(base_url + "/api/admin/send-chat", {
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

    return res;
  } catch (error) {
    console.log(error);
  }
};
