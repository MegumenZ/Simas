"use client";

import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { User } from "@/types";
import Image from "next/image";
import RefreshButton from "./RefreshButton";

interface NavbarProps {
  user: User | null;
  onMenuClick?: () => void;
}

export default function Navbar({ user, onMenuClick }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed w-full bg-white shadow-sm z-10"
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="mr-3 text-xl text-gray-700 hover:text-blue-600 md:hidden"
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
          <Image
            src="/pict/Logo-Kominfo.png"
            alt="Logo SIMAS"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-lg md:text-xl font-bold text-gray-800">SIMAS</h1>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-gray-700 hidden sm:inline text-sm md:text-base truncate max-w-[150px] md:max-w-none">
            {user?.nama_instansi}
          </span>
          <RefreshButton />
          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            className="flex items-center gap-1 text-xs md:text-sm"
          >
            <FiLogOut />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

