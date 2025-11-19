export const useNextImage = (currentImageIndexes, setCurrentImageIndexes, userPosts) => {
    const handleNextImage = (postId) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const post = userPosts.find(p => p.id === postId);
            const imagesCount = post?.images?.length || 0;
            return {
                ...prev,
                [postId]: imagesCount > 0 ? (currentIndex + 1) % imagesCount : 0
            };
        });
    };

    return { handleNextImage };
};
