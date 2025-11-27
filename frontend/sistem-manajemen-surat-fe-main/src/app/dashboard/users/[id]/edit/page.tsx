"use client";

import UserForm from "@/components/dashboard/UserForm";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import { motion } from "framer-motion";
import useUserOperations from "@/hooks/useUserOperations";

export default function EditUserPage() {
  const {
    isEdit,
    userData,
    loading,
    submitLoading,
    error,
    submitError,
    handleSubmit,
  } = useUserOperations();

  return (
    <div className="max-w-md mx-auto mt-6">
      <AnimatedDiv>
        <motion.div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {isEdit ? "Edit Penerima" : "Tambah Penerima Baru"}
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {submitError}
            </div>
          )}

          {!loading && (
            <UserForm
              onSubmit={handleSubmit}
              initialData={
                userData
                  ? {
                      id: userData.id,
                      nama_instansi: userData.nama_instansi,
                      email_instansi: userData.email_instansi,
                      role: "user",
                      password: "",
                    }
                  : undefined
              }
              loading={submitLoading}
            />
          )}
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
