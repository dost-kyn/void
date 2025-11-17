import { useState } from 'react';
import { createPost } from '../api/posts.api';
const API_URL = 'http://localhost:5000/api';

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



    const handleCreatePost = async (userId) => {
        if (!postData.title.trim() || !postData.content.trim() || !postData.categoryId) {
            setError('Заполните все обязательные поля');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Создаем пост...');
            console.log('📊 Состояние postData:', postData);
            console.log('📸 Количество фото:', postData.images.length);

            let newPost;

            // Если есть фото - используем FormData
            if (postData.images.length > 0) {
                console.log('📸 Создаем пост с фото');

                const formData = new FormData(); // ← ОПРЕДЕЛИ formData ЗДЕСЬ
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('categoryId', postData.categoryId);
                formData.append('authorId', userId);

                // Добавляем фото
                postData.images.forEach((image, index) => {
                    console.log(`➕ Добавляем фото ${index}:`, image.name);
                    formData.append('images', image);
                });

                console.log('📨 FormData создан, отправляем запрос...');
                const response = await fetch(`${API_URL}/posts/create-with-images`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to create post');
                newPost = await response.json();
                console.log('✅ Пост с фото создан:', newPost);

            } else {
                // Без фото - обычный JSON
                console.log('📝 Создаем пост без фото');
                newPost = await createPost({
                    title: postData.title,
                    content: postData.content,
                    categoryId: postData.categoryId,
                    authorId: userId
                });
                console.log('✅ Пост без фото создан:', newPost);
            }

            CloseCreate();
            return newPost;

        } catch (err) {
            setError('Ошибка при создании поста');
            console.error('❌ Error creating post:', err);
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
        handleCreatePost,
        removeImage
    };
};