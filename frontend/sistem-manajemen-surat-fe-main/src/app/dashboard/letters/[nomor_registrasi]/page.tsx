"use client";

import { useParams, useRouter } from "next/navigation";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import { motion } from "framer-motion";
import LetterStatusBadge from "@/components/dashboard/LetterStatusBadge";
import Button from "@/components/ui/Button";
import useLetterDetail from "@/hooks/useLetterDetail";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LetterDetailSection from "@/components/dashboard/LetterDetailSection";
import { formatToLocaleDate } from "@/utils/dateUtils";
import FileViewerSection from "@/components/dashboard/FileViewerSection";
import useAuth from "@/hooks/useAuth";
import { FiChevronLeft, FiEdit } from "react-icons/fi";

export default function LetterDetailPage() {
  const router = useRouter();
  const { nomor_registrasi } = useParams();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const { letter, loading, error } = useLetterDetail();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!letter) {
    return <div className="text-center py-12">Surat tidak ditemukan</div>;
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Detail Surat</h1>
        <Button
          variant="primary"
          onClick={() => router.push("/dashboard/letters")}
          className="flex items-center gap-1"
        >
          <FiChevronLeft />
          Kembali
        </Button>
      </div>

      <AnimatedDiv>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {letter.perihal}
            </h2>
            <LetterStatusBadge status={letter.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LetterDetailSection title="Pengirim" value={letter.pengirim} />
            <LetterDetailSection
              title="Penerima"
              value={letter.user!.nama_instansi}
              additionalValue={letter.user!.email_instansi}
            />
            <LetterDetailSection
              title="Nomor Surat"
              value={letter.nomor_surat}
            />
            <LetterDetailSection
              title="Tanggal Surat"
              value={formatToLocaleDate(letter.tanggal_surat)}
            />
            <LetterDetailSection
              title="Tanggal Diterima"
              value={formatToLocaleDate(letter.tanggal_masuk)}
            />
            <LetterDetailSection
              title="Nomor Registrasi"
              value={letter.nomor_registrasi}
            />
          </div>

          <FileViewerSection nomorRegistrasi={letter.nomor_registrasi} />

          {isAdmin && (
            <Button
              variant="warning"
              onClick={() =>
                router.push(`/dashboard/letters/${nomor_registrasi}/edit`)
              }
              className="flex items-center gap-1 mt-6"
            >
              <FiEdit />
              Edit
            </Button>
          )}
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
