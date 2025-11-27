"use client";

import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { FiLogOut } from "react-icons/fi";
import { User } from "@/types";
import Image from "next/image";
import RefreshButton from "./RefreshButton";
interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed w-full bg-white shadow-sm z-10"
    >
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center ">
          <Image
            src="/pict/Logo-Kominfo.png"
            alt="Logo SIMAS"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-gray-800"> SIMAS</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{user?.nama_instansi}</span>
          <RefreshButton />
          <Button
            variant="danger"
            size="sm"
            onClick={logout}
            className="flex items-center gap-1"
          >
            <FiLogOut /> Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
