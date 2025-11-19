// hooks/profile/DeletePostHandler.js
export const useDeletePostHandler = (deletePostAction, getUserIdFromToken, fetchUserPosts, ConfirmDeletePost, showActionAlert) => {
    const handleDeletePost = async () => {
        const postId = ConfirmDeletePost();
        if (!postId) return;

        console.log('🗑️ Удаляем пост ID:', postId);

        const success = await deletePostAction(postId);

        if (success) {
            console.log('✅ Пост удален, обновляем список...');
            const userId = getUserIdFromToken();
            if (userId) {
                await fetchUserPosts(userId);
            }
            showActionAlert('post_deleted', 'success');
            console.log('✅ Список постов обновлен');
            return true;
        } else {
            showActionAlert('error_generic', 'error', { message: 'Ошибка при удалении поста' });
            return false;
        }
    };

    return { handleDeletePost };
};