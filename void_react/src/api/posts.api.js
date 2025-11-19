const API_URL = 'http://localhost:5000/api';


export const createPost = async (postData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Токен не найден. Пожалуйста, войдите в систему.');
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
        let errorMessage = 'Ошибка при создании поста';
        
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
            // Если не удалось распарсить JSON, используем статус
            if (response.status === 403) {
                errorMessage = 'Доступ запрещен. Возможно, ваш аккаунт забанен.';
            } else if (response.status === 401) {
                errorMessage = 'Ошибка авторизации. Пожалуйста, войдите снова.';
            } else {
                errorMessage = `Ошибка сервера: ${response.status}`;
            }
        }
        
        throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
};

export const getUserPosts = async (userId) => {
    const response = await fetch(`${API_URL}/posts/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user posts');
    return await response.json();
};


// posts.api.js
export const getPostById = async (postId) => {
    try {
        console.log('🔄 API: Получаем пост ID:', postId);
        
        const response = await fetch(`${API_URL}/posts/${postId}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error response:', errorText);
            
            if (response.status === 404) {
                throw new Error('Пост не найден');
            } else if (response.status === 500) {
                throw new Error('Ошибка сервера при получении поста');
            } else {
                throw new Error(`Ошибка: ${response.status}`);
            }
        }

        const data = await response.json();
        console.log('✅ API: Пост успешно получен:', data);
        return data;
        
    } catch (error) {
        console.error('❌ API Error fetching post:', error);
        throw error;
    }
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