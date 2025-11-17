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

    const OpenCreate = () => {
        setIsOpen(true);
        setError(null);
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
        console.log('📁 Выбраны файлы:', files);

        // Создаем превью для отображения
        const previews = files.map(file => URL.createObjectURL(file));

        setPostData(prev => ({
            ...prev,
            images: [...prev.images, ...files],
            imagePreviews: [...prev.imagePreviews, ...previews]
        }));
    };

    // Добавим функцию удаления фото
    const removeImage = (index) => {
        setPostData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
        }));
    };


    // В CloseCreate очищаем превью
    const CloseCreate = () => {
        // Освобождаем память от превью
        postData.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));

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



    const handleCreatePost = async (authorId) => {
        if (!postData.title.trim() || !postData.content.trim() || !postData.categoryId) {
            setError('Заполните все обязательные поля');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            const newPost = await createPost({
                ...postData,
                authorId: authorId
            });

            postData.images.forEach((image, index) => {
                formData.append('images', image);
            });

            CloseCreate();
            return newPost;

        } catch (err) {
            setError('Ошибка при создании поста');
            console.error('Error creating post:', err);
            return false;
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
        handleCreatePost
    };
};