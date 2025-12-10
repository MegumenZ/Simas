"use client";

import { useState } from "react";
import Navbar from "@/components/dashboard/Navbar";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Sidebar from "@/components/dashboard/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 h-16 z-50 bg-white shadow flex items-center">
        <Navbar user={user} onMenuClick={toggleMobile} />
      </div>

      <Sidebar
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobile}
      />
      <main
        className={`pt-20 transition-all duration-300 p-4 md:p-6 ml-0 ${isCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
      >
        {children}
      </main>
    </div>
  );
}
