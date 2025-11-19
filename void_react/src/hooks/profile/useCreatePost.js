// hooks/useCreatePost.js
import { useState } from 'react';
import { createPost } from '../api/posts.api';

export const useCreatePost = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        categoryId: '',
        images: [],
        imagePreviews: []
    });

    const OpenCreate = () => setIsOpen(true);
    const CloseCreate = () => {
        setIsOpen(false);
        setError(null);
        setPostData({
            title: '',
            content: '',
            categoryId: '',
            images: [],
            imagePreviews: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...postData.images, ...files];
        const newPreviews = newImages.map(file => URL.createObjectURL(file));
        
        setPostData(prev => ({
            ...prev,
            images: newImages,
            imagePreviews: newPreviews
        }));
    };

    const removeImage = (index) => {
        const newImages = postData.images.filter((_, i) => i !== index);
        const newPreviews = postData.imagePreviews.filter((_, i) => i !== index);
        
        setPostData(prev => ({
            ...prev,
            images: newImages,
            imagePreviews: newPreviews
        }));
    };

    const handleCreatePost = async (userId) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔄 Создание поста...');
            
            const postDataToSend = {
                title: postData.title,
                content: postData.content,
                categoryId: parseInt(postData.categoryId),
                authorId: parseInt(userId)
            };

            console.log('📤 Отправляемые данные:', postDataToSend);

            const result = await createPost(postDataToSend);
            
            console.log('✅ Пост создан успешно:', result);
            
            // Сбрасываем форму
            setPostData({
                title: '',
                content: '',
                categoryId: '',
                images: [],
                imagePreviews: []
            });
            
            CloseCreate();
            return true;
            
        } catch (error) {
            console.error('❌ Ошибка при создании поста:', error);
            setError(error.message);
            throw error; // Пробрасываем ошибку дальше
        } finally {
            setLoading(false);
        }
    };

    return {
        isOpen,
        loading,
        error,
        postData,
        OpenCreate,
        CloseCreate,
        handleInputChange,
        handleFileChange,
        removeImage,
        handleCreatePost
    };
};