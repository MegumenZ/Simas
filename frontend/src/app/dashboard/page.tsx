"use client";

import useAuth from "@/hooks/useAuth";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import { motion } from "framer-motion";
import { FiMail, FiUsers, FiFileText, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import { UserRole } from "@/types";
import { formatToLocaleDate } from "@/utils/dateUtils";
import StatCard from "@/components/dashboard/StatCard";
import { dashboardService } from "@/services/dashboardService";

type DashboardStats = {
  totalSurat: number;
  totalUsers?: number;
  recentLetters: Array<{
    id: number;
    nomor_surat: string;
    perihal: string;
    tanggal_surat: string;
    status: string;
  }>;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!user) return;

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await dashboardService.getStats(
        user.role === UserRole.ADMIN
      );
      setStats(data);
    } catch (error) {
      console.error("Gagal memuat statistik:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, [user]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "diterima":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 py-16 space-y-6">
      <AnimatedDiv>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat Datang, {user?.nama_instansi}
          </h1>
          <p className="text-gray-600 mt-2">
            Sistem Manajemen Arsip
          </p>
        </motion.div>
      </AnimatedDiv>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
          user?.role === "admin" ? "lg:grid-cols-2" : "lg:grid-cols-1"
        }`}
      >
        {user?.role === UserRole.ADMIN && (
          <StatCard
            icon={<FiFileText className="text-blue-500" size={24} />}
            title="Total Surat"
            value={stats?.totalSurat || 0}
            loading={loading}
            color="blue"
          />
        )}

        {user?.role === UserRole.ADMIN && (
          <StatCard
            icon={<FiUsers className="text-purple-500" size={24} />}
            title="Total Pengguna"
            value={stats?.totalUsers || 0}
            loading={loading}
            color="purple"
          />
        )}
        {user?.role === UserRole.USER && (
          <StatCard
            icon={<FiMail className="text-green-500" size={24} />}
            title="Surat Saya"
            value={stats?.totalSurat || 0}
            loading={loading}
            color="green"
          />
        )}
      </div>

      <AnimatedDiv delay={0.1}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FiClock className="text-yellow-500" />
              Surat Terbaru
            </h2>
            <span className="text-sm text-gray-500">5 terakhir</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded animate-pulse"
                ></div>
              ))}
            </div>
          ) : stats?.recentLetters && stats.recentLetters.length > 0 ? (
            <div className="space-y-3">
              {stats.recentLetters.map((letter) => (
                <div
                  key={letter.id}
                  className="p-4 border border-gray-100 hover:bg-gray-50 rounded-lg transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">
                        {letter.nomor_surat}
                      </div>
                      <div className="text-sm text-gray-600">
                        {letter.perihal}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        letter.status
                      )}`}
                    >
                      {letter.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {formatToLocaleDate(letter.tanggal_surat)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada surat terbaru
            </div>
          )}
        </motion.div>
      </AnimatedDiv>
    </div>
  );
}
