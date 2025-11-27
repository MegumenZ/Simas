"use client";

import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { motion } from "framer-motion";
import { FiRefreshCcw } from "react-icons/fi";

interface UserFormProps {
  initialData?: {
    id?: number;
    nama_instansi: string;
    email_instansi: string;
    role: "user";
    password?: string;
  };
  onSubmit: (data: {
    nama_instansi: string;
    email_instansi: string;
    password?: string;
    role: "user";
  }) => Promise<void>;
  loading?: boolean;
}

export default function UserForm({
  initialData,
  onSubmit,
  loading,
}: UserFormProps) {
  const isUpdateMode = !!initialData?.id;

  const [formData, setFormData] = useState({
    nama_instansi: initialData?.nama_instansi || "",
    email_instansi: initialData?.email_instansi || "",
    password: "",
    role: "user" as const,
  });

  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nama_instansi || !formData.email_instansi) {
      setError("Nama instansi dan email harus diisi");
      return;
    }

    if (!isUpdateMode && !formData.password) {
      setError("Password harus diisi untuk user baru");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password harus minimal 6 karakter");
      return;
    }

    const submitData = {
      nama_instansi: formData.nama_instansi,
      email_instansi: formData.email_instansi,
      role: formData.role,
      ...(formData.password ? { password: formData.password } : {}),
    };

    try {
      await onSubmit(submitData);
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan user. Silakan coba lagi.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-700 p-3 rounded-md text-sm"
        >
          {error}
        </motion.div>
      )}

      <Input
        label="Nama Instansi"
        value={formData.nama_instansi}
        onChange={(e) =>
          setFormData({ ...formData, nama_instansi: e.target.value })
        }
        required
        className="text-black"
        placeholder="Dinas Kominfo Bandar Lampung"
      />

      <Input
        label="Email Instansi"
        type="email"
        value={formData.email_instansi}
        onChange={(e) =>
          setFormData({ ...formData, email_instansi: e.target.value })
        }
        required
        disabled={isUpdateMode}
        className={`text-black ${
          isUpdateMode ? "opacity-70 bg-gray-100 cursor-not-allowed" : ""
        }`}
        placeholder="diskominfo@balam.go.id"
      />

      <Input
        label={
          isUpdateMode
            ? "Password (Biarkan kosong jika tidak diubah)"
            : "Password"
        }
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={!isUpdateMode}
        minLength={isUpdateMode ? undefined : 6}
        className="text-black"
        placeholder="Minimal 6 karakter..."
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        variant="success"
        loading={loading}
      >
        {isUpdateMode ? (
          <span className="flex items-center justify-center gap-2 w-full">
            <FiRefreshCcw size={16} />
            Update Penerima
          </span>
        ) : (
          "+ Tambah User"
        )}
      </Button>
    </form>
  );
}
