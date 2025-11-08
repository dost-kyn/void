import { useState } from "react";

export const useDeleteProfile = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const OpenDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const CloseDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const DeleteProfile = () => {
    console.log("Профиль удаляется...");
    // Логика удаления профиля
    CloseDelete();
  };

  const СancelDeleteProfile = () => {
    console.log("Удаление отменено");
    CloseDelete();
  };

  return {
    isDeleteModalOpen,
    OpenDelete,
    CloseDelete,
    DeleteProfile,
    СancelDeleteProfile
  };
};