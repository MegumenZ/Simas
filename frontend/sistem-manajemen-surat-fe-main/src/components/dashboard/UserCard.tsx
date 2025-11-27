"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import { User } from "@/types";

interface UserCardProps {
  user: User;
  onClick?: () => void;
  actions?: {
    icon: React.ReactNode;
    onClick: () => void;
    label: string;
    variant?: "primary" | "danger" | "warning";
  }[];
}

export default function UserCard({
  user,
  onClick,
  actions = [],
}: UserCardProps) {
  return (
    <div
      onClick={onClick}
      className="hover:shadow-md transition h-full"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col"
      >
        <div className="p-4 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.nama_instansi}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {user.email_instansi}
              </p>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs px-5 py-1 rounded-full whitespace-nowrap">
              {user.total_surat} surat
            </span>
          </div>
          {actions.length > 0 && (
            <div className="mt-4 flex space-x-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant}
                  className={`flex items-center gap-1 ${
                    action.variant === "danger"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                >
                  {action.icon} {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
