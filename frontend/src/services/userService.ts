import { apiClient } from "@/app/api/client";
import { User } from "@/types";

export const userService = {
  async register(data: {
    email_instansi: string;
    password?: string;
    nama_instansi: string;
    role: "admin" | "user";
  }) {
    return apiClient.post("/api/users", data);
  },

  async updateProfile(data: { nama_instansi?: string; password?: string }) {
    return apiClient.patch("/api/users/current", data);
  },

  async getAllUsers() {
    return apiClient.get("/api/users");
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get(`/api/users/${id}`);
    return response.data;
  },

  async updateUserById(
    id: number,
    data: {
      nama_instansi?: string;
      email_instansi?: string;
      password?: string;
      role?: "admin" | "user";
    }
  ) {
    return apiClient.patch(`/api/users/${id}`, data);
  },

  async deleteUser(id: number) {
    return apiClient.delete(`/api/users/${id}`);
  },
};
