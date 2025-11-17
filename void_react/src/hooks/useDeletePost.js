import { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export const useDeletePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deletePost = async (postId) => {
        setLoading(true);
        setError(null);

        try {
            console.log('🗑️ Удаляем пост ID:', postId);

            const response = await fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE'
            });

            console.log('📡 Ответ сервера (статус):', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Ошибка удаления поста:', errorText);
                throw new Error(`Failed to delete post: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Пост удален:', result);
            return result;

        } catch (err) {
            setError('Ошибка при удалении поста');
            console.error('❌ Error deleting post:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deletePost
    };
};