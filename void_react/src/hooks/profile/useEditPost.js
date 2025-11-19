const handleUpdatePost = async () => {
    setLoading(true);
    
    try {
        console.log('🔄 Начинаем обновление поста...');
        console.log('📊 Состояние postData:', editPostData);
        console.log('📸 Количество новых фото:', editPostData.images.length);
        console.log('🖼️ Новые фото:', editPostData.images);
        console.log('🏞️ Существующие фото:', editPostData.existingImages);

        if (editPostData.images.length > 0) {
            // Если есть новые изображения - отправляем FormData
            console.log('📸 Отправляем пост с новыми фото');
            
            const formData = new FormData();
            formData.append('title', editPostData.title);
            formData.append('content', editPostData.content);
            formData.append('categoryId', editPostData.categoryId.toString());
            
            // Добавляем каждое изображение отдельно
            editPostData.images.forEach((image, index) => {
                console.log(`➕ Добавляем фото ${index}:`, image.name, image);
                formData.append('images', image);
            });

            console.log('📨 FormData создан, отправляем запрос...');
            
            const response = await fetch(`http://localhost:5000/api/posts/update-with-images/${editPostData.id}`, {
                method: 'PUT',
                body: formData
                // Не устанавливаем Content-Type - браузер сделает это автоматически для FormData
            });

            console.log('📡 Ответ сервера (статус):', response.status);
            console.log('📡 Ответ сервера (ok):', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Ошибка ответа сервера:', errorText);
                throw new Error(`Failed to update post: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Пост успешно обновлен с фото:', result);
            
        } else {
            // Если нет новых изображений - отправляем JSON
            console.log('📝 Отправляем пост без новых фото');
            
            const postDataToSend = {
                title: editPostData.title,
                content: editPostData.content,
                categoryId: parseInt(editPostData.categoryId)
            };

            console.log('📨 JSON данные:', postDataToSend);
            
            const response = await fetch(`http://localhost:5000/api/posts/update/${editPostData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postDataToSend)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update post: ${response.status} ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Пост успешно обновлен:', result);
        }
        
        CloseEdit();
        return true;
        
    } catch (error) {
        console.error('❌ Error updating post:', error);
        console.error('❌ Error stack:', error.stack);
        setError(error.message);
        alert('Ошибка при обновлении поста: ' + error.message);
        return false;
    } finally {
        setLoading(false);
    }
};