const API_URL = 'http://localhost:5000/api';


export const createPost = async (postData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Токен не найден');
    }

    const response = await fetch(`${API_URL}/posts/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: `HTTP error! status: ${response.status}` };
        }
        
        // Пробрасываем сообщение об ошибке от сервера
        throw new Error(errorData.error || `Ошибка создания поста: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
    console.log('📝 API: Обновляем пост без фото ID:', postId);
    console.log('📝 API: Данные:', postData);

    try {
        const response = await fetch(`${API_URL}/posts/update/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        console.log('📡 API Response status:', response.status);
        console.log('📡 API Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error response:', errorText);
            throw new Error(`Failed to update post: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ API Update successful:', result);
        return result;
    } catch (error) {
        console.error('❌ API Update error:', error);
        throw error;
    }
};

export const updatePostWithImages = async (postId, formData) => {
    const response = await fetch(`${API_URL}/posts/update-with-images/${postId}`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) throw new Error('Failed to update post');
    return await response.json();
};