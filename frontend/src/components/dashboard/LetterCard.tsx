"use client";

import { motion } from "framer-motion";
import { Letter } from "@/types";
import LetterStatusBadge from "./LetterStatusBadge";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";
import { FiEye, FiEdit2, FiInbox } from "react-icons/fi";
import { formatToLocaleDate } from "@/utils/dateUtils";
import { FilePreviewDownload } from "./FilePreviewDownload";

interface LetterCardProps {
  letter: Letter;
  onStatusChange?: (id: number, status: "diterima" | "pending") => void;
  isAdmin?: boolean;
}

export default function LetterCard({
  letter,
  onStatusChange,
  isAdmin,
}: LetterCardProps) {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col"
    >
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {letter.perihal}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {letter.nomor_surat} • {letter.pengirim}
            </p>
          </div>
          <LetterStatusBadge status={letter.status} />
        </div>

        <div className="mt-4 text-sm text-gray-700">
          <p>Tujuan: {letter.user?.nama_instansi}</p>
          <p className="mt-1">
            Tanggal Surat: {formatToLocaleDate(letter.tanggal_surat)}
          </p>
          <p className="mt-1">
            Tanggal Masuk: {formatToLocaleDate(letter.tanggal_masuk)}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-1"
            onClick={() =>
              router.push(`/dashboard/letters/${letter.nomor_registrasi}`)
            }
          >
            <FiEye /> Detail
          </Button>

          {letter.file_url && (
            <FilePreviewDownload nomorRegistrasi={letter.nomor_registrasi} />
          )}

          {isAdmin && (
            <Button
              size="sm"
              className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
              onClick={() =>
                router.push(
                  `/dashboard/letters/${letter.nomor_registrasi}/edit`
                )
              }
            >
              <FiEdit2 /> Edit
            </Button>
          )}

          {!isAdmin && letter.status === "pending" && (
            <Button
              variant="success"
              size="sm"
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 focus:ring-green-500"
              onClick={() =>
                onStatusChange?.(letter.nomor_registrasi, "diterima")
              }
            >
              <FiInbox />
              Terima
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
