"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  size = "2xl",
}: ModalProps) {
  const sizeClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[size];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-lg shadow-xl w-full ${sizeClass} p-0 relative overflow-hidden`}
          >
            <div className="p-6 max-h-[80vh] overflow-y-auto scrollbar-hidden rounded-b-2xl">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                aria-label="Tutup modal"
              >
                &times;
              </button>
              {title && (
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {title}
                </h3>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
