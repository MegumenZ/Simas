"use client";

import { useState } from "react";
import UserCard from "@/components/dashboard/UserCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRouter } from "next/navigation";
import useUsers from "@/hooks/useUsers";
import useLetters from "@/hooks/useLetters";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import useUserOperations from "@/hooks/useUserOperations";
import { User } from "@/types";
import { motion } from "framer-motion";
import DeleteUserModal from "@/components/dashboard/DeleteUserModal";

export default function UsersList() {
  const router = useRouter();
  const {
    users,
    loading: usersLoading,
    error: usersError,
    setUsers,
  } = useUsers();
  const {
    letters,
    loading: lettersLoading,
    error: lettersError,
  } = useLetters();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { deleteUser, isDeleting, deleteError, setDeleteError } =
    useUserOperations();

  const filteredUsers = users.filter((user) => user.role !== "admin");
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    const hasLetters = letters.some(
      (letter) => letter.user!.id === userToDelete.id
    );
    const success = await deleteUser(userToDelete.id, hasLetters);

    if (success) {
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setUserToDelete(null);
    }
  };

  if (usersLoading || lettersLoading) {
    return <LoadingSpinner />;
  }

  if (usersError || lettersError) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md">
        {usersError || lettersError}
      </div>
    );
  }

  return (
    <div className="relative p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {filteredUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            actions={[
              {
                icon: <FaEdit size={16} />,
                onClick: () => router.push(`/dashboard/users/${user.id}/edit`),
                label: "Edit",
                variant: "warning" as const,
              },
              {
                icon: <FaTrash size={16} />,
                onClick: () => setUserToDelete(user),
                label: "Delete",
                variant: "danger" as const,
              },
              {
                icon: <FiEye size={16} />,
                onClick: () => router.push(`/dashboard/users/${user.id}`),
                label: "Detail",
                variant: "primary" as const,
              },
            ]}
          />
        ))}
      </motion.div>

      <DeleteUserModal
        isOpen={!!userToDelete}
        onClose={() => {
          setUserToDelete(null);
          setDeleteError("");
        }}
        user={userToDelete}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
