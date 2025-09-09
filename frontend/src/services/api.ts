// src/services/api.ts
// Handles all API requests in one place.
// Makes it easy to update baseURL or add error handling globally.

const API_URL = "http://localhost:5000/api";

export const api = {
  // Generic GET
  get: async (endpoint: string, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Generic POST
  post: async (endpoint: string, data: any, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Generic PUT
  put: async (endpoint: string, data: any, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Generic DELETE
  delete: async (endpoint: string, token?: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
