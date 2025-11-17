import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/posts/`);
            
            if (!response.ok) {
                throw new Error(`Ошибка загрузки постов: ${response.status}`);
            }
            
            const postsData = await response.json();
            setPosts(postsData);
        } catch (err) {
            console.error('Ошибка при загрузке постов:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return {
        posts,
        loading,
        error,
        refetch: fetchPosts
    };
};