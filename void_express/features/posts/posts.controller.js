const PostsService = require("./posts.service");

// exports.getAllPosts = async (req, res, next) => {
//   const posts = await PostsService.getAllPosts
//   if (posts.length <= 0) {
//     const error = new Error("Посты не найдены");
//     error.status = 404;
//     return next(error);
//   }
//   res.status(200).json(posts);
// };


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