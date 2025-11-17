const bd = require('../../utils/configuration.prisma')

//===============  вызвать все посты
exports.getAllPosts = async () => {
    const posts = await bd.post.findMany({
        include: {
            user_post_ship: {
                select: {
                    id: true,
                    login: true,
                    name: true,
                    last_name: true
                }
            },
            post_category_ship: {
                select: {
                    name: true
                }
            },
            images: {  // ← ДОБАВЬ ЭТО!
                orderBy: { image_order: 'asc' }
            }
        }
    })
    return posts
}

//===============  вызвать посты пользователя
exports.getUserPosts = async (userId) => {
    const posts = await bd.post.findMany({
        where: {
            user_id: parseInt(userId)
        },
        include: {
            post_category_ship: {
                select: {
                    name: true
                }
            },
            user_post_ship: {
                select: {
                    login: true,
                    name: true,
                    last_name: true
                }
            },
            images: {  // ← ДОБАВЬ ЭТО!
                orderBy: { image_order: 'asc' }
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    })
    return posts
}

//===============  вызвать пост по ID
exports.getPostById = async (id) => {
    try {
        console.log('🔍 Сервис: ищем пост ID:', postId);
        if (id) {
            const postId = parseInt(id)
            const post = await bd.post.findUnique({
                where: { id: postId },
                include: {
                    user_post_ship: {
                        select: {
                            login: true,
                            name: true,
                            last_name: true,
                            avatar: true
                        }
                    },
                    post_category_ship: {
                        select: {
                            name: true
                        }
                    }
                }
            })
            console.log('✅ Сервис: пост найден:', post ? post.title : 'null');
            console.log('🖼️ Сервис: изображения:', post ? post.images : 'null');
            return post
        }
        return null
    } catch (error) {
        console.error('❌ Сервис: ошибка поиска поста:', error);
        throw error;
    }
}

//===============  валидация создания поста
exports.VerifyCreatePost = async (postData) => {
    if (!postData.title) {
        return "Введите название поста"
    }
    if (!postData.content) {
        return "Введите текст поста"
    }
    if (!postData.categoryId) {
        return "Выберите категорию"
    }
    if (!postData.authorId) {
        return "Ошибка авторизации"
    }
    return null
}

//===============  создание поста
exports.createPost = async (postData) => {
    const post = await bd.post.create({
        data: {
            title: postData.title,
            text: postData.content,
            category_id: parseInt(postData.categoryId),
            user_id: parseInt(postData.authorId)
        }
    })
    return post
}


//===============  добавить фото к посту
exports.addPostImage = async (postId, imageUrl, order) => {
    console.log(`🖼️ Сервис: добавляем фото к посту ${postId}`);
    console.log(`🖼️ URL: ${imageUrl}, порядок: ${order}`);

    try {
        const image = await bd.post_image.create({
            data: {
                post_id: parseInt(postId),
                image_url: imageUrl,
                image_order: parseInt(order)
            }
        });
        console.log('✅ Фото добавлено в БД:', image);
        return image;
    } catch (error) {
        console.error('❌ Ошибка добавления фото в БД:', error);
        throw error;
    }
}


//===============  найти пост по ID
exports.findPostById = async (id) => {
    if (id) {
        const postId = parseInt(id)
        const post = await bd.post.findUnique({
            where: { id: postId },
            include: {
                post_category_ship: {
                    select: {
                        name: true,
                        id: true
                    }
                },
                images: {
                    select: {
                        id: true,
                        image_url: true,
                        image_order: true
                    },
                    orderBy: { image_order: 'asc' }
                }
            }
        })
        return post
    }
    return null
}

//===============  обновление поста
exports.updatePost = async (id, postData) => {
    const post = await bd.post.update({
        where: { id: parseInt(id) },
        data: {
            title: postData.title,
            text: postData.content,
            category_id: parseInt(postData.categoryId)
        }
    })
    return post
}

//===============  добавление фото к посту
exports.addPostImage = async (postId, imageUrl, imageOrder = 0) => {
    const postImage = await bd.post_image.create({
        data: {
            image_url: imageUrl,
            image_order: imageOrder,
            post_id: parseInt(postId)
        }
    })
    return postImage
}

//===============  удаление фото поста
exports.deletePostImage = async (imageId) => {
    if (imageId) {
        const image = await bd.post_image.delete({
            where: { id: parseInt(imageId) }
        })
        return image
    }
    return null
}

//===============  получить фото поста
exports.getPostImages = async (postId) => {
    console.log(`🔍 Сервис: получаем фото поста ${postId}`);
    try {
        const images = await bd.post_image.findMany({
            where: { post_id: parseInt(postId) },
            orderBy: { image_order: 'asc' }
        });
        console.log(`✅ Найдено фото:`, images);
        return images;
    } catch (error) {
        console.error('❌ Ошибка получения фото:', error);
        throw error;
    }
}


//===============  найти фото по ID
exports.findPostImageById = async (imageId) => {
    const image = await bd.post_image.findUnique({
        where: { id: parseInt(imageId) }
    })
    return image
}

//===============  удалить фото
exports.deletePostImage = async (imageId) => {
    const image = await bd.post_image.delete({
        where: { id: parseInt(imageId) }
    })
    return image
}

//===============  удалить пост
exports.deletePost = async (postId) => {
    const post = await bd.post.delete({
        where: { id: parseInt(postId) }
    })
    return post
}

//===============  удалить все фото поста
exports.deletePostImagesByPostId = async (postId) => {
    const images = await bd.post_image.deleteMany({
        where: { post_id: parseInt(postId) }
    })
    return images
}