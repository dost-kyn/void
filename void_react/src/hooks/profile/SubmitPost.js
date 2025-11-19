
export const useSubmitPost = (handleCreatePost, getUserIdFromToken, fetchUserPosts, showActionAlert) => {
    const handleSubmitPost = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            showActionAlert('error_generic', 'error', { message: 'Пользователь не авторизован' });
            return false;
        }
        const success = await handleCreatePost(userId);

        if (success) {
            await fetchUserPosts(userId);
            showActionAlert('post_created', 'success');
            return true;
        } else {
            showActionAlert('error_generic', 'error', { message: 'Ошибка при создании поста' });
            return false;
        }
    };

    return { handleSubmitPost };
};