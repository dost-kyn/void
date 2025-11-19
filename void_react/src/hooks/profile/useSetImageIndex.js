
export const useSetImageIndex = (setCurrentImageIndexes) => {
    const handleSetImageIndex = (postId, index) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [postId]: index
        }));
    };

    return { handleSetImageIndex };
};