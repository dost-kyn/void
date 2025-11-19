// hooks/useSubmitEditPost.js
export const useSubmitEditPost = (handleUpdatePost, getUserIdFromToken, fetchUserPosts, showActionAlert) => {
    const handleSubmitEditPost = async () => {
        const updatedPost = await handleUpdatePost();
        if (updatedPost) {
            const userId = getUserIdFromToken();
            if (userId) {
                await fetchUserPosts(userId);
            }
            showActionAlert('post_updated', 'success');
            return true;
        } else {
            showActionAlert('error_generic', 'error', { message: 'Ошибка при обновлении поста' });
            return false;
        }
    };

    return { handleSubmitEditPost };
};