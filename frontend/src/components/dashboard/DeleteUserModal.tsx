"use client";

import { User } from "@/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isDeleting: boolean;
  error?: string;
  onConfirm: () => void;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
  isDeleting,
  error,
  onConfirm,
}: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus User">
      <div className="space-y-4">
        <div className="text-gray-600">
          Apakah Anda yakin ingin menghapus user{" "}
          <strong>{user.nama_instansi}</strong>?
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="primary" onClick={onClose} disabled={isDeleting}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isDeleting}
            loading={isDeleting}
          >
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
