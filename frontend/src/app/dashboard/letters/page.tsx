"use client";

import { useState } from "react";
import LetterCard from "@/components/dashboard/LetterCard";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Link from "next/link";
import useLetters from "@/hooks/useLetters";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Pagination from "@/components/ui/Pagination";
import MonthlyReportGenerator from "@/components/dashboard/MonthlyReportGenerator/Index";

export default function LettersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [month, setMonth] = useState<number | undefined>(
    new Date().getMonth() + 1
  );
  const [year, setYear] = useState<number | undefined>(
    new Date().getFullYear()
  );
  const limit = 10;

  const {
    letters,
    loading,
    error,
    updateLetterStatus,
    isAdmin,
    currentUserId,
    pagination,
  } = useLetters(currentPage, limit, month, year);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const filteredLetters = isAdmin
    ? letters
    : letters.filter((letter) => letter.user?.id === currentUserId);

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Kotak Surat</h1>
        </div>
        {isAdmin && (
          <Link href="/dashboard/letters/add">
            <Button className="w-full sm:w-auto">+ Tambah Surat</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 text-black">
          <label className="text-sm text-black font-medium whitespace-nowrap">Bulan:</label>
          <select
            value={month || ""}
            onChange={(e) =>
              setMonth(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="h-10 px-3 border border-gray-600 rounded text-sm text-black flex-1 sm:flex-none"
          >
            <option value="0">Semua</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-black whitespace-nowrap">Tahun:</label>
          <input
            type="number"
            value={year || ""}
            onChange={(e) =>
              setYear(e.target.value ? parseInt(e.target.value) : undefined)
            }
            className="h-10 w-full sm:w-24 px-3 border text-black border-gray-600 rounded text-sm"
            placeholder="Tahun"
            min="2000"
            max="2100"
          />
        </div>

        {isAdmin && (
          <div className="sm:ml-auto">
            <MonthlyReportGenerator
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
            />
          </div>
        )}
      </div>

      {filteredLetters.length === 0 ? (
        <AnimatedDiv className="text-center py-12">
          <p className="text-gray-500">Belum ada surat yang tercatat</p>
        </AnimatedDiv>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredLetters.map((letter, index) => (
              <AnimatedDiv key={letter.nomor_registrasi} delay={index * 0.05}>
                <LetterCard
                  letter={letter}
                  onStatusChange={updateLetterStatus}
                  isAdmin={isAdmin}
                />
              </AnimatedDiv>
            ))}
          </motion.div>

          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
}
