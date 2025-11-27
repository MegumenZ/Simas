"use client";

import { useState, useEffect } from "react";
import { Letter } from "@/types";
import { apiClient } from "@/app/api/client";
import { useParams } from "next/navigation";

export default function useLetterDetail() {
  const { nomor_registrasi } = useParams();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await apiClient.get(`/api/surat/${nomor_registrasi}`);
        setLetter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch letter");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [nomor_registrasi]);

  return {
    letter,
    loading,
    error,
  };
}
