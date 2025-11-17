import { useState } from 'react';

export const useDeletePostModal = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [postToDelete, setPostToDelete] = useState(null);

    const OpenDeletePost = (postId) => {
        setPostToDelete(postId);
        setIsOpen(true);
    };

    const CloseDeletePost = () => {
        setIsOpen(false);
        setPostToDelete(null);
    };

    const ConfirmDeletePost = () => {
        if (postToDelete) {
            CloseDeletePost();
            return postToDelete;
        }
        return null;
    };

    const CancelDeletePost = () => {
        CloseDeletePost();
        return null;
    };

    return {
        isDeletePostModalOpen: isOpen,
        postToDelete,
        OpenDeletePost,
        CloseDeletePost,
        ConfirmDeletePost,
        CancelDeletePost
    };
};