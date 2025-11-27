import { useState, useEffect } from "react";
import { Letter, User } from "@/types";
import { letterService } from "@/services/letterService";
import { apiClient } from "@/app/api/client";
import Cookies from "js-cookie";

interface LettersResponse {
  data: Letter[];
  total: number;
  page: number;
  totalPages: number;
}

export default function useLetters(
  currentPage = 1,
  limit = 10,
  month?: number,
  year?: number
) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchUserAndLetters = async () => {
      try {
        setLoading(true);
        setError(null);

        const userResponse = await apiClient.get("/api/users/current");
        const currentUser = userResponse.data;
        setUser(currentUser);
        Cookies.set("user", JSON.stringify(currentUser));

        const response: LettersResponse = await letterService.getLetters(
          currentUser.role === "user",
          currentPage,
          limit,
          month,
          year
        );

        setLetters(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          totalPages: response.totalPages,
        });
      } catch (err) {
        console.error("Error fetching user or letters:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        Cookies.remove("token");
        Cookies.remove("user");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndLetters();
  }, [currentPage, limit, month, year]);

  const updateLetterStatus = async (
    id: number,
    status: "diterima" | "pending"
  ) => {
    try {
      await letterService.updateLetterStatus(id, status);
      setLetters((prev) =>
        prev.map((l) => (l.nomor_registrasi === id ? { ...l, status } : l))
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      return false;
    }
  };

  return {
    letters,
    loading,
    error,
    updateLetterStatus,
    isAdmin: user?.role === "admin",
    currentUserId: user?.id,
    pagination,
  };
}
