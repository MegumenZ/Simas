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

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 h-16 z-50 bg-white shadow flex items-center">
        <Navbar user={user} />
      </div>

      <Sidebar
        user={user}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <main
        className={`pt-16 transition-all duration-300 p-6 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
