"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import AnimatedDiv from "@/components/ui/AnimatedDiv";
import Button from "@/components/ui/Button";
import { FiKey, FiLoader } from "react-icons/fi";
import ProfileModal from "@/components/dashboard/ProfileModal";
import { dashboardService } from "@/services/dashboardService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userLetters, setUserLetters] = useState({ incoming: 0, outgoing: 0 });
  const [loadingLetters, setLoadingLetters] = useState(true);
  const { user, loading } = useAuth();

  useEffect(() => {
    const fetchUserLetters = async () => {
      if (!user) return;

      try {
        setLoadingLetters(true);

        const { data } = await dashboardService.getStats(user.role === "admin");

        setUserLetters({
          incoming:
            user.role === "admin"
              ? data.surat_dibuat || data.totalSurat || 0
              : data.totalSurat || 0,
          outgoing: 0,
        });
      } catch (error) {
        console.error("Error fetching user letters:", error);
        setUserLetters({ incoming: 0, outgoing: 0 });
      } finally {
        setLoadingLetters(false);
      }
    };

    fetchUserLetters();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Anda belum login</p>
          <Button onClick={() => (window.location.href = "/login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 mt-6 py-16">
      <AnimatedDiv>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Profil Pengguna
          </h1>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm text-gray-500">Nama Instansi</h3>
              <p className="text-lg text-gray-800 font-medium">
                {user.nama_instansi || "Tidak tersedia"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Email Instansi</h3>
              <p className="text-gray-700">
                {user.email_instansi || user.email_instansi || "Tidak tersedia"}
              </p>
            </div>

            <div>
              <h3 className="text-sm text-gray-500">Peran</h3>
              <p className="text-gray-700 capitalize">
                {user.role || "Tidak tersedia"}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                onClick={() => setIsModalOpen(true)}
              >
                <FiKey /> Ganti Password
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatedDiv>

      <AnimatedDiv delay={0.1}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Aktivitas
          </h2>
          <div className="grid gap-4 text-center grid-cols-1">
            <div>
              {loadingLetters ? (
                <div className="flex items-center justify-center">
                  <FiLoader className="animate-spin text-2xl text-blue-600" />
                </div>
              ) : (
                <p className="text-3xl font-bold text-blue-600">
                  {userLetters.incoming}
                </p>
              )}
              <p className="text-gray-600">Total Surat</p>
            </div>
          </div>
        </motion.div>
      </AnimatedDiv>

      {/* Modal Ganti Password */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
      />
    </div>
  );
}
