import { useState } from 'react';
import { updatePost, getPostById } from '../api/posts.api';

export const useEditPost = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postData, setPostData] = useState({
        id: null,
        title: '',
        content: '',
        categoryId: '',
        images: []
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
                images: post.images || []
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
            const updatedPost = await updatePost(postData.id, {
                title: postData.title,
                content: postData.content,
                categoryId: postData.categoryId
            });
            
            CloseEdit();
            return updatedPost;
            
        } catch (err) {
            setError('Ошибка при обновлении поста');
            console.error('Error updating post:', err);
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
        handleUpdatePost
    };
};