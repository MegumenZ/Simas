"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/api/client";
import { User } from "@/types";
import Cookies from "js-cookie";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userCookie = Cookies.get("user");

    if (!userCookie) {
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);
    } catch (err) {
      console.error("Failed to parse user cookie:", err);
      Cookies.remove("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/api/users/login", {
        email_instansi: email,
        password,
      });

      const { token, user: userData } = response.data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("user", JSON.stringify(userData), { expires: 1 });

      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Email atau password salah"
      );
    }
  };

  const logout = async () => {
    try {
      await apiClient.delete("/api/users/current");
    } catch (error) {
      console.error("Logout error:", error);
    }

    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
  };

  return { user, loading, login, logout };
}
