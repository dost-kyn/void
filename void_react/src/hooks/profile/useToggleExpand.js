
import { useState } from 'react';

export const useToggleExpand = () => {
    const [expandedPosts, setExpandedPosts] = useState({});

    const handleToggleExpand = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return {
        expandedPosts,
        handleToggleExpand
    };
};