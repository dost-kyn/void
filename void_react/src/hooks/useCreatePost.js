import { useState } from 'react';
import { createPost } from '../api/posts.api';

export const useCreatePost = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        categoryId: ''
    });

    const OpenCreate = () => {
        setIsOpen(true);
        setError(null);
    };

    const CloseCreate = () => {
        setIsOpen(false);
        setError(null);
        setPostData({
            title: '',
            content: '',
            categoryId: '',
            image: null
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
        const file = e.target.files[0];
        setPostData(prev => ({
            ...prev,
            image: file
        }));
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