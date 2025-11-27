"use client";

import UserForm from "@/components/dashboard/UserForm";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import { motion } from "framer-motion";
import useUserOperations from "@/hooks/useUserOperations";

export default function AddUserPage() {
  const { handleSubmit, submitLoading } = useUserOperations();

  return (
    <div className="max-w-md mx-auto mt-6">
      <AnimatedDiv>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Tambah User Baru
          </h1>
          <UserForm onSubmit={handleSubmit} loading={submitLoading} />
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
