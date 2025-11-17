const API_URL = 'http://localhost:5000/api';

export const createPost = async (postData) => {
    const response = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) throw new Error('Failed to create post');
    return await response.json();
};

export const getUserPosts = async (userId) => {
    const response = await fetch(`${API_URL}/posts/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return await response.json();
};


export const getPostById = async (postId) => {
    const response = await fetch(`${API_URL}/posts/${postId}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return await response.json();
};

export const updatePost = async (postId, postData) => {
    const response = await fetch(`${API_URL}/posts/update/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) throw new Error('Failed to update post');
    return await response.json();
};