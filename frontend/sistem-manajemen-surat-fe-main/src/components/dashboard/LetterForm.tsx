"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Letter, User } from "@/types";
import { FiCornerDownLeft, FiSave } from "react-icons/fi";
import { formatDateForInput } from "@/utils/dateUtils";

interface LetterFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  users: User[];
  loading: boolean;
  initialData?: Letter;
}

export default function LetterForm({
  onSubmit,
  users,
  loading,
  initialData,
}: LetterFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    if (initialData?.file_url && !formData.get("file")) {
      formData.set("file_url", initialData.file_url);
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Form submission error:", err);
      setError("Gagal menyimpan surat.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-100 text-red-700 p-3 rounded-md"
        >
          {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Pengirim"
          name="pengirim"
          defaultValue={initialData?.pengirim}
          required
          className="text-black"
        />

        <Input
          label="Nomor Surat"
          name="nomor_surat"
          defaultValue={initialData?.nomor_surat}
          required
          className="text-black"
        />

        <Input
          label="Tanggal Surat"
          name="tanggal_surat"
          type="date"
          defaultValue={
            initialData?.tanggal_surat
              ? formatDateForInput(initialData.tanggal_surat)
              : ""
          }
          required
          className="text-black"
        />

        <Input
          label="Tanggal Masuk"
          name="tanggal_masuk"
          type="date"
          defaultValue={
            initialData?.tanggal_masuk
              ? formatDateForInput(initialData.tanggal_masuk)
              : ""
          }
          required
          className="text-black"
        />
      </div>

      <div className="space-y-1 text-black">
        <label className="block text-sm font-medium text-gray-700">
          Penerima
        </label>
        <select
          name="user_id"
          defaultValue={initialData?.user?.id || initialData?.user_id}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={loading}
        >
          <option value="">Pilih Penerima</option>
          {users
            .filter((user) => user.role !== "admin")
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.nama_instansi} ({user.email_instansi})
              </option>
            ))}
        </select>
      </div>

      <Input
        label="Perihal"
        name="perihal"
        defaultValue={initialData?.perihal}
        required
        className="text-black"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          File Surat (PDF/Docx)
        </label>
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx"
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required={!initialData?.file_url}
          disabled={loading}
        />
        {initialData?.file_url && (
          <p className="text-sm text-gray-500 mt-1">
            File Saat Ini: {initialData.file_url.split("\\").pop()}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="primary"
          onClick={() => router.back()}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <FiCornerDownLeft />
          Kembali
        </Button>
        <Button
          type="submit"
          disabled={loading}
          variant="success"
          loading={loading}
          className="flex items-center gap-1"
        >
          <FiSave />
          {loading ? "Menyimpan..." : "Simpan Surat"}
        </Button>
      </div>
    </form>
  );
}
