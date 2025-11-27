import Cookies from "js-cookie";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = Cookies.get("token");

    const headers = new Headers();

    if (!(options.body instanceof FormData)) {
      headers.append("Content-Type", "application/json");
    }

    if (token) {
      headers.append("X-API-TOKEN", token);
    }

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.append(key, value);
      });
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        Cookies.remove("token");
        Cookies.remove("user");
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors || "Request failed");
    }

    return response.json();
  },

  async get(endpoint: string) {
    return this.request(endpoint, { method: "GET" });
  },

  async post<T = unknown>(endpoint: string, body: T) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async put<T = unknown>(endpoint: string, body: T) {
    return this.request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async patch<T = unknown>(endpoint: string, body: T) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  async delete(endpoint: string) {
    return this.request(endpoint, { method: "DELETE" });
  },

  async upload(endpoint: string, formData: FormData) {
    const token = Cookies.get("token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "X-API-TOKEN": token || "",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors || "Upload failed");
    }

    return response.json();
  },
};
