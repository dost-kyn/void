import { useState } from 'react';
import { updatePost, getPostById } from '../api/posts.api';
const API_URL = 'http://localhost:5000/api';

export const useEditPost = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postData, setPostData] = useState({
        id: null,
        title: '',
        content: '',
        categoryId: '',
        images: [], // новые фото
        imagePreviews: [], // превью новых фото
        existingImages: [] // уже существующие фото из БД
    });

    const OpenEdit = async (postId) => {
        try {
            setLoading(true);
            const post = await getPostById(postId);

            setPostData({
                id: post.id,
                title: post.title,
                content: post.text,
                categoryId: post.category_id,
                images: [],
                imagePreviews: [],
                existingImages: post.images || []
            });

            setIsOpen(true);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки поста');
            console.error('Error loading post:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        // console.log('📁 Выбраны файлы в редактировании:', files);
        // console.log('📁 Тип files:', typeof files);
        // console.log('📁 files[0]:', files[0]);
        // console.log('📁 files.length:', files.length);

        // Создаем превью для отображения
        const previews = files.map(file => {
            // console.log('🖼️ Создаем превью для:', file.name);
            return URL.createObjectURL(file);
        });

        setPostData(prev => {
            const newState = {
                ...prev,
                images: [...prev.images, ...files],
                imagePreviews: [...prev.imagePreviews, ...previews]
            };
            // console.log('🔄 Новое состояние после выбора файлов:', newState);
            return newState;
        });
    };

    const removeNewImage = (index) => {
        setPostData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
            imagePreviews: prev.imagePreviews.filter((_, i) => i !== index)
        }));
    };

    const removeExistingImage = async (imageId) => {
        try {
            // console.log('🗑️ Удаляем существующее фото ID:', imageId);

            // Сначала удаляем на сервере
            const response = await fetch(`${API_URL}/posts/images/${imageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete image');
            }

            // console.log('✅ Фото удалено с сервера');

            // Затем удаляем из состояния
            setPostData(prev => ({
                ...prev,
                existingImages: prev.existingImages.filter(img => img.id !== imageId)
            }));

        } catch (error) {
            console.error('❌ Ошибка удаления фото:', error);
            alert('Ошибка при удалении изображения');
        }
    };

    const CloseEdit = () => {
        setIsOpen(false);
        setError(null);
        setPostData({
            id: null,
            title: '',
            content: '',
            categoryId: '',
            images: []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdatePost = async () => {
        if (!postData.title.trim() || !postData.content.trim() || !postData.categoryId) {
            setError('Заполните все обязательные поля');
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            // console.log('🔄 Начинаем обновление поста...');
            // console.log('📊 Состояние postData:', postData);
            // console.log('📸 Количество новых фото:', postData.images.length);
            // console.log('🖼️ Новые фото:', postData.images);
            // console.log('🏞️ Существующие фото:', postData.existingImages);

            let updatedPost;

            // Если есть новые фото - используем FormData
            if (postData.images.length > 0) {
                // console.log('📸 Отправляем пост с новыми фото');

                const formData = new FormData();
                formData.append('title', postData.title);
                formData.append('content', postData.content);
                formData.append('categoryId', postData.categoryId);

                // Добавляем новые фото
                postData.images.forEach((image, index) => {
                    // console.log(`➕ Добавляем фото ${index}:`, image.name, image);
                    formData.append('images', image);
                });

                // console.log('📨 FormData создан, отправляем запрос...');
                const response = await fetch(`${API_URL}/posts/update-with-images/${postData.id}`, {
                    method: 'PUT',
                    body: formData
                });

                // console.log('📡 Ответ сервера (статус):', response.status);
                // console.log('📡 Ответ сервера (ok):', response.ok);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Ошибка ответа сервера:', errorText);
                    throw new Error(`Failed to update post: ${response.status} ${errorText}`);
                }

                updatedPost = await response.json();
                // console.log('✅ Пост с фото обновлен:', updatedPost);

            } else {
                // Без новых фото - обычный JSON
                // console.log('📝 Отправляем пост без новых фото');
                // console.log('📦 Данные для отправки:', {
                //     title: postData.title,
                //     content: postData.content,
                //     categoryId: postData.categoryId
                // });

                try {
                    updatedPost = await updatePost(postData.id, {
                        title: postData.title,
                        content: postData.content,
                        categoryId: postData.categoryId
                    });
                    // console.log('✅ Пост без фото обновлен:', updatedPost);
                } catch (updateError) {
                    console.error('❌ Ошибка в updatePost функции:', updateError);
                    throw updateError;
                }
            }

            CloseEdit();
            return updatedPost;

        } catch (err) {
            setError('Ошибка при обновлении поста');
            console.error('❌ Error updating post:', err);
            console.error('❌ Error stack:', err.stack);
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
        OpenEdit,
        CloseEdit,
        handleInputChange,
        handleFileChange,
        removeNewImage,
        removeExistingImage,
        handleUpdatePost
    };
};