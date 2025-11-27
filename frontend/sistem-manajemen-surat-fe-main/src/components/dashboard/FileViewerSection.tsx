import { useState } from "react";
import Button from "@/components/ui/Button";
import { FiDownload } from "react-icons/fi";
import Cookies from "js-cookie";

export default function FileDownloadButton({
  nomorRegistrasi,
}: {
  nomorRegistrasi: number;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

 const handleDownload = async () => {
  setIsDownloading(true);
  setError("");

  try {
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const token = Cookies.get("token");

    const response = await fetch(
      `${API_BASE_URL}/api/surat/${nomorRegistrasi}/file`,
      {
        headers: {
          "X-API-TOKEN": `${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        response.status === 401
          ? "Anda tidak memiliki izin."
          : "Gagal mengunduh dokumen."
      );
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const contentDisposition = response.headers.get("Content-Disposition");
    const match = contentDisposition?.match(/filename="?([^"]+)"?/);
    const originalFileName = match?.[1] || `surat-bjbjbj${nomorRegistrasi}.pdf`;

    const link = document.createElement("a");
    link.href = url;
    link.download = originalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Gagal mengunduh dokumen.");
  } finally {
    setIsDownloading(false);
  }
};


  return (
    <div className="flex flex-col gap-2 mt-6">
      <Button
        onClick={handleDownload}
        loading={isDownloading}
        loadingText="Mengunduh..."
        variant="success"
        size="md"
        className="flex items-center gap-1 w-fit"
      >
        <FiDownload /> Unduh Dokumen
      </Button>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
