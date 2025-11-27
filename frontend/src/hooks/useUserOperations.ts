"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types";
import { userService } from "@/services/userService";

export default function useUserOperations() {
  const params = useParams();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const rawId = params?.id;
  const numericId =
    typeof rawId === "string"
      ? parseInt(rawId)
      : Array.isArray(rawId)
      ? parseInt(rawId[0])
      : NaN;

  const isEdit = !isNaN(numericId);

  useEffect(() => {
    if (!isEdit) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await userService.getById(numericId);
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Gagal mengambil data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [numericId, isEdit]);

  const handleSubmit = async (data: {
    nama_instansi: string;
    email_instansi: string;
    password?: string;
    role: "user";
  }) => {
    try {
      setSubmitLoading(true);
      setSubmitError("");

      if (isEdit) {
        await userService.updateUserById(numericId, data);
      } else {
        await userService.register(data);
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      console.error("Failed to submit user:", error);
      setSubmitError("Terjadi kesalahan saat menyimpan data");
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteUser = async (userId: number, hasLetters: boolean) => {
    try {
      setIsDeleting(true);
      setDeleteError("");

      if (hasLetters) {
        throw new Error("User memiliki surat, tidak dapat dihapus");
      }

      await userService.deleteUser(userId);
      return true;
    } catch (err) {
      console.error(err);
      setDeleteError("User memiliki surat, tidak dapat dihapus");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isEdit,
    userData,
    loading, 
    error,
    handleSubmit,
    submitLoading,
    submitError, 
    deleteUser,
    isDeleting,
    deleteError,
    setDeleteError
  };
}
