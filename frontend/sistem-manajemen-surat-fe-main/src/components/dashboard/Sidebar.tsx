"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiInbox,
  FiUsers,
  FiFilePlus,
  FiUserPlus,
  FiHome,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { motion } from "framer-motion";
import { User } from "@/types";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: User;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  user,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: <FiHome />, label: "Dashboard" },
    {
      href: "/dashboard/profile",
      icon: <CgProfile />,
      label: "Profil Pengguna",
    },
    { href: "/dashboard/letters", icon: <FiInbox />, label: "Kotak Surat" },
    ...(user?.role === "admin"
      ? [
          {
            href: "/dashboard/letters/add",
            icon: <FiFilePlus />,
            label: "Tambah Surat",
          },
          { href: "/dashboard/users", icon: <FiUsers />, label: "Penerima" },
          {
            href: "/dashboard/users/add",
            icon: <FiUserPlus />,
            label: "Tambah Penerima",
          },
        ]
      : []),
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md h-screen fixed top-0 left-0 z-40 pt-16 overflow-hidden"
    >
      <div className="flex items-center p-4 ml-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-xl text-black"
        >
          {isCollapsed ? <FiMenu /> : <FiX />}
        </button>
      </div>

      <nav className="space-y-2 px-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <div
              className={`flex items-center p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl px-2">{item.icon}</span>
              <span
                className={`ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                {item.label}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </motion.div>
  );
}
