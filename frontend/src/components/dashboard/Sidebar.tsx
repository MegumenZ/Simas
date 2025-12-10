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
import { motion, AnimatePresence } from "framer-motion";
import { User } from "@/types";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  user: User;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  user,
  isMobileOpen = false,
  onMobileClose,
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

  const handleNavClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: isCollapsed ? 80 : 256,
          x: isMobileOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 768 ? -256 : 0),
        }}
        transition={{ duration: 0.3 }}
        className={`bg-white shadow-md h-screen fixed top-0 left-0 z-40 pt-16 overflow-hidden
          hidden md:block
          ${isMobileOpen ? "!block" : ""}
        `}
      >
        {/* Desktop toggle button */}
        <div className="hidden md:flex items-center p-4 ml-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xl text-black"
          >
            {isCollapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        {/* Mobile close button */}
        <div className="flex md:hidden items-center justify-end p-4 pr-6">
          <button
            onClick={onMobileClose}
            className="text-xl text-black"
          >
            <FiX />
          </button>
        </div>

        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} onClick={handleNavClick}>
              <div
                className={`flex items-center p-3 rounded-lg transition-colors ${pathname === item.href
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span className="text-xl px-2">{item.icon}</span>
                <span
                  className={`ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden ${isCollapsed && !isMobileOpen ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
                    }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </nav>
      </motion.div>
    </>
  );
}

