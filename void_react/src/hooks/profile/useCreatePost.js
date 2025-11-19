// hooks/useCreatePost.js
const handleCreatePost = async (userId) => {
    if (!userId) {
        showActionAlert('error_generic', 'error', { message: 'Пользователь не авторизован' });
        return false;
    }

    // Валидация
    if (!postData.title.trim() || !postData.content.trim() || !postData.categoryId) {
        showActionAlert('error_generic', 'error', { message: 'Заполните все обязательные поля' });
        return false;
    }

    setLoading(true);
    setError(null);

    try {
        console.log('🔄 Создаем пост...');
        console.log('📊 Состояние postData:', postData);

        const formData = new FormData();
        
        // Добавляем основные данные
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('categoryId', postData.categoryId);
        formData.append('userId', userId);

        // Добавляем изображения
        if (postData.images.length > 0) {
            console.log('📸 Создаем пост с фото');
            postData.images.forEach((image, index) => {
                console.log(`➕ Добавляем фото ${index}:`, image.name);
                formData.append('images', image);
            });
        }

        console.log('📨 FormData создан, отправляем запрос...');

        const response = await fetch('http://localhost:5000/api/posts/create-with-images', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        });

        console.log('📡 Статус ответа:', response.status);
        
        if (!response.ok) {
            // Попробуем получить текст ошибки от сервера
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.message || `HTTP error! status: ${response.status}`;
                console.error('❌ Ошибка сервера (JSON):', errorData);
            } catch (e) {
                errorText = await response.text();
                console.error('❌ Ошибка сервера (text):', errorText);
            }
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log('✅ Пост создан успешно:', data);
        showActionAlert('post_created', 'success');
        CloseCreate();
        return true;

    } catch (error) {
        console.error('❌ Error creating post:', error);
        const errorMessage = error.message || 'Ошибка при создании поста';
        setError(errorMessage);
        showActionAlert('error_generic', 'error', { message: errorMessage });
        return false;
    } finally {
        setLoading(false);
    }
};