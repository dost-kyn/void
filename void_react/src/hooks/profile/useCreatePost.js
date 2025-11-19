// hooks/useCreatePost.js
import { useState } from 'react';
import { createPost } from '../api/posts.api';

export const useCreatePost = (initialState = false) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [loading, setLoading] = useState(false);
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
        
        try {
            const postDataToSend = {
                title: postData.title,
                content: postData.content,
                categoryId: parseInt(postData.categoryId),
                authorId: parseInt(userId)
            };

            await createPost(postDataToSend);
            
            setPostData({
                title: '',
                content: '',
                categoryId: '',
                images: [],
                imagePreviews: []
            });
            
            return true;
            
        } catch (error) {

            return true;
        } finally {
            setLoading(false);
        }
    };

    return {
        isOpen,
        loading,
        postData,
        OpenCreate,
        CloseCreate,
        handleInputChange,
        handleFileChange,
        removeImage,
        handleCreatePost
    };
};