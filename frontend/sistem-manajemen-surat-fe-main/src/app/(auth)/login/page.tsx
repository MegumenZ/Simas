"use client";

import { motion } from "framer-motion";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div
  className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
  style={{ backgroundImage: "url('/pict/bg-SIMAS.jpg')" }}
>
      <AnimatedDiv className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <Image
              src="/pict/Logo-Kominfo-Nama.png"
              alt="Logo SIMAS"
              width={96}
              height={96}
              className="mx-auto w-1/4 mb-8"
            />
            <h1 className="text-3xl font-bold text-blue-800">SIMAS</h1>
            <h2 className="text-gray-600 mt-2">Sistem Manajemen Surat</h2>
          </div>

          <LoginForm />
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
