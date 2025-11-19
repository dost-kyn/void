
import { useState } from 'react';
import { getUserPosts } from '../../api/posts.api';

export const useFetchUserPosts = (showActionAlert) => {
    const [userPosts, setUserPosts] = useState([]);

    const fetchUserPosts = async (userId) => {
        try {
            const posts = await getUserPosts(userId);
            setUserPosts(posts);
        } catch (error) {
            console.error('❌ Ошибка загрузки постов:', error);
            setUserPosts([]);
            showActionAlert('error_generic', 'error', { message: 'Ошибка загрузки постов' });
        }
    };

    return {
        userPosts,
        setUserPosts,
        fetchUserPosts
    };
};