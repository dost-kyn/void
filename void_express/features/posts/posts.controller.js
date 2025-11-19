const PostsService = require("./posts.service");

// GET /api/posts/ - все посты
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostsService.getAllPosts()
    res.status(200).json(posts)
  } catch (error) {
    console.error('Ошибка получения постов:', error)
    res.status(500).json({ error: 'Ошибка сервера при получении постов' })
  }
}

// GET /api/posts/user/:userId - посты пользователя
exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await PostsService.getUserPosts(userId);

    // Должны возвращаться посты с фото
    console.log(`📊 Загружено постов пользователя ${userId}:`, posts.length);
    if (posts.length > 0) {
      console.log('🖼️ Первый пост имеет фото:', posts[0].images);
    }

    res.json(posts);
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};



exports.createPost = async (req, res) => {
  try {
    console.log('📨 Получен запрос на создание поста:', req.body);

    const { title, content, categoryId, authorId } = req.body;

    // Валидация
    const validationError = await PostsService.VerifyCreatePost({
      title, content, categoryId, authorId
    });
    if (validationError) {
      console.log('❌ Ошибка валидации:', validationError);
      return res.status(400).json({ error: validationError });
    }

    console.log('🔍 Создаем пост в БД...');
    const newPost = await PostsService.createPost({
      title, content, categoryId, authorId
    });

    console.log('✅ Пост создан:', newPost);
    res.status(201).json({
      message: 'Пост успешно создан',
      post: newPost
    });

  } catch (error) {
    console.error('❌ Ошибка создания поста:', error);
    
    // Обрабатываем ошибку бана отдельно
    if (error.message.includes('забанен')) {
      return res.status(403).json({ 
        error: 'Вы не можете публиковать посты, так как ваш аккаунт забанен за нарушение правил публикации постов' 
      });
    }
    
    res.status(500).json({ error: 'Ошибка сервера при создании поста' });
  }
}

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Контроллер: Получаем пост ID:', id);
    console.log('🔍 Контроллер: Тип ID:', typeof id);

    if (!id) {
      console.log('❌ Контроллер: ID не предоставлен');
      return res.status(400).json({ error: 'ID поста обязателен' });
    }

    // Проверяем, что ID - число
    const postId = parseInt(id);
    if (isNaN(postId)) {
      console.log('❌ Контроллер: Неверный формат ID:', id);
      return res.status(400).json({ error: 'Неверный формат ID поста' });
    }

    console.log('🔄 Контроллер: Вызываем сервис...');
    const post = await PostsService.getPostById(postId);

    if (!post) {
      console.log('❌ Контроллер: Пост не найден в БД');
      return res.status(404).json({ error: 'Пост не найден' });
    }

    console.log('✅ Контроллер: Пост найден:', post.title);
    console.log('🖼️ Контроллер: Изображения поста:', post.images);

    res.json(post);
  } catch (error) {
    console.error('❌ Контроллер: Ошибка получения поста:', error);
    console.error('❌ Контроллер: Stack:', error.stack);
    res.status(500).json({ 
      error: 'Ошибка сервера при получении поста',
      details: error.message 
    });
  }
};

// PUT /api/posts/update/:id - обновить пост
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, categoryId } = req.body

    console.log('🔄 Обновляем пост без фото ID:', id);
    console.log('📝 Данные:', { title, content, categoryId });

    // Проверяем существование поста
    const existingPost = await PostsService.findPostById(id)
    if (!existingPost) {
      console.log('❌ Пост не найден');
      return res.status(404).json({ error: 'Пост не найден' })
    }

    console.log('✅ Пост найден:', existingPost.title);

    // Валидация
    if (!title || !content || !categoryId) {
      console.log('❌ Не все обязательные поля заполнены');
      return res.status(400).json({ error: 'Заполните все обязательные поля' })
    }

    console.log('📝 Обновляем пост в БД...');
    const updatedPost = await PostsService.updatePost(id, {
      title, content, categoryId
    })

    console.log('✅ Пост обновлен:', updatedPost);

    res.json({
      message: 'Пост успешно обновлен',
      post: updatedPost
    })

  } catch (error) {
    console.error('❌ Ошибка обновления поста:', error)
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ error: 'Ошибка сервера при обновлении поста' })
  }
}

// POST /api/posts/:id/images - добавить фото к посту
exports.addPostImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    // Сохраняем путь к файлу
    const imageUrl = '/uploads/posts/' + req.file.filename;

    // Получаем текущее количество фото у поста для порядка
    const postImages = await bd.post_image.findMany({
      where: { post_id: parseInt(id) }
    });
    const imageOrder = postImages.length;

    const postImage = await PostsService.addPostImage(id, imageUrl, imageOrder);

    res.json({
      message: 'Фото успешно добавлено',
      image: postImage
    });

  } catch (error) {
    console.error('Ошибка добавления фото:', error);
    res.status(500).json({ error: 'Ошибка сервера при добавлении фото' });
  }
}


// POST /api/posts/create-with-images - создать пост с фото
exports.createPostWithImages = async (req, res) => {
  try {
    const { title, content, categoryId, authorId } = req.body;

    // Валидация
    const validationError = await PostsService.VerifyCreatePost({
      title, content, categoryId, authorId
    });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Создаем пост
    const newPost = await PostsService.createPost({
      title, content, categoryId, authorId
    });

    // Добавляем фото если есть
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const imageUrl = '/uploads/posts/' + req.files[i].filename;
        await PostsService.addPostImage(newPost.id, imageUrl, i);
      }
    }

    // Получаем пост с фото
    const postWithImages = await PostsService.findPostById(newPost.id);

    res.status(201).json({
      message: 'Пост успешно создан',
      post: postWithImages
    });

  } catch (error) {
    console.error('Ошибка создания поста с фото:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании поста' });
  }
}

exports.updatePostWithImages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Получаем данные из FormData
    const { title, content, categoryId } = req.body;

    console.log('🔄 Контроллер: Обновляем пост с фото ID:', id);
    console.log('📝 Контроллер: Данные:', { title, content, categoryId });
    console.log('📸 Контроллер: Файлы:', req.files);
    console.log('📸 Контроллер: Количество файлов:', req.files ? req.files.length : 0);

    // Проверяем существование поста
    const existingPost = await PostsService.findPostById(id);
    if (!existingPost) {
      console.log('❌ Контроллер: Пост не найден');
      return res.status(404).json({ error: 'Пост не найден' });
    }

    console.log('✅ Контроллер: Пост найден:', existingPost.title);

    // Валидация обязательных полей
    if (!title || !content || !categoryId) {
      console.log('❌ Контроллер: Не все обязательные поля заполнены');
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    // Обновляем пост
    console.log('📝 Контроллер: Обновляем данные поста...');
    const updatedPost = await PostsService.updatePost(id, {
      title, 
      content, 
      categoryId: parseInt(categoryId)
    });
    console.log('✅ Контроллер: Пост обновлен:', updatedPost);

    // Добавляем новые фото если есть
    if (req.files && req.files.length > 0) {
      console.log('➕ Контроллер: Добавляем новые фото к посту');

      // Получаем текущие фото для определения порядка
      const currentImages = await PostsService.getPostImages(id);
      console.log('📊 Контроллер: Текущие фото поста:', currentImages);
      console.log('📊 Контроллер: Количество текущих фото:', currentImages.length);

      const startOrder = currentImages.length;
      console.log('🔢 Контроллер: Начинаем порядок с:', startOrder);

      for (let i = 0; i < req.files.length; i++) {
        const imageUrl = '/uploads/posts/' + req.files[i].filename;
        console.log(`🖼️ Контроллер: Добавляем фото ${i}:`, imageUrl);
        console.log(`🔢 Контроллер: Порядок фото: ${startOrder + i}`);

        await PostsService.addPostImage(id, imageUrl, startOrder + i);
        console.log(`✅ Контроллер: Фото ${i} добавлено`);
      }
    }

    // Получаем обновленный пост с фото
    console.log('🔍 Контроллер: Получаем обновленный пост...');
    const postWithImages = await PostsService.findPostById(id);
    console.log('🎉 Контроллер: Пост полностью обновлен');

    res.json({
      message: 'Пост успешно обновлен',
      post: postWithImages
    });

  } catch (error) {
    console.error('❌ Контроллер: Ошибка обновления поста с фото:', error);
    console.error('❌ Контроллер: Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Ошибка сервера при обновлении поста',
      details: error.message 
    });
  }
}



// DELETE /api/posts/images/:imageId - удалить фото поста
exports.deletePostImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    console.log('🗑️ Удаляем фото ID:', imageId);

    // Проверяем существование фото
    const existingImage = await PostsService.findPostImageById(imageId);
    if (!existingImage) {
      console.log('❌ Фото не найдено');
      return res.status(404).json({ error: 'Фото не найдено' });
    }

    console.log('✅ Фото найдено:', existingImage.image_url);

    // Удаляем фото из БД
    await PostsService.deletePostImage(imageId);

    // TODO: Также можно удалить файл из папки uploads
    const fs = require('fs').promises;
    const filePath = '.' + existingImage.image_url; // добавляем точку для относительного пути

    try {
      await fs.access(filePath); // проверяем существует ли файл
      await fs.unlink(filePath); // удаляем файл
      console.log('✅ Файл удален с диска:', filePath);
    } catch (fileError) {
      console.warn('⚠️ Не удалось удалить файл с диска:', fileError.message);
    }

    console.log('✅ Фото удалено из БД');

    res.json({
      message: 'Фото успешно удалено'
    });

  } catch (error) {
    console.error('❌ Ошибка удаления фото:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении фото' });
  }
};

// DELETE /api/posts/:id - удалить пост
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Удаляем пост ID:', id);

    // Проверяем существование поста
    const existingPost = await PostsService.findPostById(id);
    if (!existingPost) {
      console.log('❌ Пост не найден');
      return res.status(404).json({ error: 'Пост не найден' });
    }

    console.log('✅ Пост найден:', existingPost.title);

    // Сначала удаляем все фото поста (если есть)
    const postImages = await PostsService.getPostImages(id);
    if (postImages.length > 0) {
      console.log('🗑️ Удаляем фото поста:', postImages.length);

      // TODO: Можно добавить удаление файлов с диска
      const fs = require('fs').promises;
      for (const image of postImages) {
        try {
          await fs.unlink('.' + image.image_url);
        } catch (fileError) {
          console.warn('⚠️ Не удалось удалить файл:', fileError.message);
        }
      }

      // Удаляем фото из БД
      await PostsService.deletePostImagesByPostId(id);
    }

    // Удаляем сам пост
    await PostsService.deletePost(id);

    console.log('✅ Пост удален из БД');

    res.json({
      message: 'Пост успешно удален'
    });

  } catch (error) {
    console.error('❌ Ошибка удаления поста:', error);
    res.status(500).json({ error: 'Ошибка сервера при удалении поста' });
  }
};




// ======= ДЛЯ АДМИНКИ =======

//=============== получить все посты для админки
exports.getAllPostsForAdmin = async (req, res) => {
  try {
    // console.log('🔄 [ADMIN] Запрос всех постов для админки');
    const posts = await PostsService.getAllPostsForAdmin();
    // console.log(`✅ [ADMIN] Успешно загружено ${posts.length} постов`);
    res.json(posts);
  } catch (error) {
    // console.error('❌ [ADMIN] Ошибка загрузки постов для админки:', error);
    // console.error('❌ [ADMIN] Stack trace:', error.stack);
    res.status(500).json({
      error: error.message,
      details: 'Ошибка сервера при загрузке постов для админки'
    });
  }
};

//=============== обновить статус поста
exports.updatePostStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log('🔄 [CONTROLLER] Обновление статуса поста:', { id, status });

    if (!id) {
      console.log('❌ [CONTROLLER] ID поста не указан');
      return res.status(400).json({ error: 'ID поста обязателен' });
    }

    if (!status) {
      console.log('❌ [CONTROLLER] Статус не указан');
      return res.status(400).json({ error: 'Статус обязателен' });
    }

    const updatedPost = await PostsService.updatePostStatus(id, status);

    console.log('✅ [CONTROLLER] Статус успешно обновлен:', updatedPost);
    res.json(updatedPost);

  } catch (error) {
    console.error('❌ [CONTROLLER] Ошибка обновления статуса:', error);
    console.error('❌ [CONTROLLER] Stack trace:', error.stack);
    res.status(500).json({
      error: error.message,
      details: 'Внутренняя ошибка сервера при обновлении статуса'
    });
  }
};