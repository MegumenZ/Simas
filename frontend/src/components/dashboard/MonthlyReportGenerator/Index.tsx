"use client";

import { useState, useEffect, useMemo } from "react";
import { pdf } from "@react-pdf/renderer";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatToLocaleDate } from "@/utils/dateUtils";
import { MonthlyReportDocument } from "./MonthlyReportDocument";
import { letterService } from "@/services/letterService";
import { FiDownload } from "react-icons/fi";
import { HiOutlineDocumentReport } from "react-icons/hi";

export interface Letter {
  tanggal_masuk: string;
  tanggal_masuk_formatted: string;
  pengirim: string;
  tujuan?: string;
  penerima?: string;
  perihal: string;
}

interface MonthlyReportGeneratorProps {
  month?: number;
  year?: number;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
}

export const MonthlyReportGenerator = ({
  month: propMonth,
  year: propYear,
}: MonthlyReportGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState(propMonth ?? new Date().getMonth() + 1);
  const [year, setYear] = useState(propYear ?? new Date().getFullYear());
  const [pdfInstance, setPdfInstance] = useState<Blob | null>(null);

  useEffect(() => {
    if (propMonth !== undefined) setMonth(propMonth);
    if (propYear !== undefined) setYear(propYear);
  }, [propMonth, propYear]);

  useEffect(() => setPdfInstance(null), [month, year]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);
      setPdfInstance(null);
      const res = await letterService.getMonthlyReport(month!, year!);
      const formatted = {
        ...res.data,
        surat: (res.data.surat as Letter[]).map((s: Letter) => ({
          ...s,
          tanggal_masuk_formatted: formatToLocaleDate(s.tanggal_masuk),
        })),
        month,
        year,
      };
      const blob = await pdf(
        <MonthlyReportDocument data={formatted} />
      ).toBlob();
      setPdfInstance(blob);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal mengambil data laporan");
      }
    } finally {
      setLoading(false);
    }
  };

  const pdfUrl = useMemo(
    () => (pdfInstance ? URL.createObjectURL(pdfInstance) : null),
    [pdfInstance]
  );

  const isFilterComplete =
    typeof month === "number" && typeof year === "number";

  return (
    <div className="relative space-y-3">
      {isFilterComplete && (
        <div className="flex items-center gap-2">
          {month !== 0 && (
            <Button
              onClick={fetchReportData}
              disabled={loading}
              size="md"
              className="flex items-center gap-2"
              loading={loading}
            >
              <HiOutlineDocumentReport size={18} />
              Buat Laporan
            </Button>
          )}
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={`Rekap_Sanapati_${month}_${year}.pdf`}
              onClick={() =>
                setTimeout(() => URL.revokeObjectURL(pdfUrl!), 100)
              }
            >
              <Button
                variant="success"
                className="text-black flex items-center gap-2"
                size="md"
              >
                <FiDownload size={18} />
                Unduh PDF
              </Button>
            </a>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading && (
        <div className="absolute top-full left-0 mt-2">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default MonthlyReportGenerator;
