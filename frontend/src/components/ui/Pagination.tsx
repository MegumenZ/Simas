"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5; // Maximum visible page numbers
    
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust if we're at the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Always show first page
    if (start > 1) {
      visiblePages.push(1);
      if (start > 2) {
        visiblePages.push("ellipsis-left");
      }
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      if (i > 0 && i <= totalPages) {
        visiblePages.push(i);
      }
    }

    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        visiblePages.push("ellipsis-right");
      }
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 rounded-full text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-sm"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 mx-2">
        {getVisiblePages().map((page, index) => {
          if (page === "ellipsis-left" || page === "ellipsis-right") {
            return (
              <span key={index} className="px-2 py-1 text-gray-400">
                <FiMoreHorizontal className="w-4 h-4" />
              </span>
            );
          }
          
          return (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                page === currentPage
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:shadow-sm"
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center p-2 rounded-full text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-sm"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}