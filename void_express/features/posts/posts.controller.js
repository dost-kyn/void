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
    const { userId } = req.params
    const posts = await PostsService.getUserPosts(userId)
    res.status(200).json(posts)
  } catch (error) {
    console.error('Ошибка получения постов пользователя:', error)
    res.status(500).json({ error: 'Ошибка сервера при получении постов' })
  }
}

// POST /api/posts/create - создать пост
exports.createPost = async (req, res) => {
  try {
    console.log('📨 Получен запрос на создание поста:', req.body);

    const { title, content, categoryId, authorId } = req.body;

    // Валидация
    const validationError = await PostsService.VerifyCreatePost({
      title, content, categoryId, authorId
    })
    if (validationError) {
      console.log('❌ Ошибка валидации:', validationError);
      return res.status(400).json({ error: validationError })
    }

    console.log('🔍 Создаем пост в БД...');
    const newPost = await PostsService.createPost({
      title, content, categoryId, authorId
    })

    console.log('✅ Пост создан:', newPost);
    res.status(201).json({
      message: 'Пост успешно создан',
      post: newPost
    })

  } catch (error) {
    console.error('❌ Ошибка создания поста:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании поста' })
  }
}

// GET /api/posts/:id - получить пост по ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params
        const post = await PostsService.findPostById(id)
        
        if (!post) {
            return res.status(404).json({ error: 'Пост не найден' })
        }
        
        res.status(200).json(post)
    } catch (error) {
        console.error('Ошибка получения поста:', error)
        res.status(500).json({ error: 'Ошибка сервера при получении поста' })
    }
},

// PUT /api/posts/update/:id - обновить пост
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { title, content, categoryId } = req.body

        // Проверяем существование поста
        const existingPost = await PostsService.findPostById(id)
        if (!existingPost) {
            return res.status(404).json({ error: 'Пост не найден' })
        }

        // Валидация
        if (!title || !content || !categoryId) {
            return res.status(400).json({ error: 'Заполните все обязательные поля' })
        }

        const updatedPost = await PostsService.updatePost(id, {
            title, content, categoryId
        })

        res.json({
            message: 'Пост успешно обновлен',
            post: updatedPost
        })

    } catch (error) {
        console.error('Ошибка обновления поста:', error)
        res.status(500).json({ error: 'Ошибка сервера при обновлении поста' })
    }
},

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