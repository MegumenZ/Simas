"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LetterForm from "@/components/dashboard/LetterForm";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import useUsers from "@/hooks/useUsers";
import { letterService } from "@/services/letterService";

export default function AddLetterPage() {
  const router = useRouter();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError("");

      await letterService.createLetter(formData);
      router.push("/dashboard/letters");
    } catch (err) {
      console.error(err);
      setSubmitError("Gagal menambahkan surat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const error = usersError || submitError;

  return (
    <div className="max-w-3xl mx-auto mt-6 ">
      <AnimatedDiv>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Tambah Surat Baru
          </h1>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-100 text-red-700 p-3 rounded-md mb-4"
            >
              {error}
            </motion.div>
          )}

          <LetterForm
            onSubmit={handleSubmit}
            users={users}
            loading={usersLoading || isSubmitting}
          />
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
