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
    // Сначала проверяем, не забанен ли пользователь
    const user = await bd.user.findUnique({
        where: { id: parseInt(postData.authorId) },
        select: { status: true }
    });

    if (!user) {
        throw new Error('Пользователь не найден');
    }

    if (user.status === 'Ban') {
        throw new Error('Вы не можете публиковать посты, так как ваш аккаунт забанен за нарушение правил публикации постов');
    }

    // Если пользователь не забанен, создаем пост
    const post = await bd.post.create({
        data: {
            title: postData.title,
            text: postData.content,
            category_id: parseInt(postData.categoryId),
            user_id: parseInt(postData.authorId),
            status: 'Expectation'
        }
    });
    return post;
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

exports.findPostById = async (id) => {
    try {
        const postId = parseInt(id);
        if (isNaN(postId)) return null;

        const post = await bd.post.findUnique({
            where: { id: postId }
        });
        
        return post;
    } catch (error) {
        console.error('❌ Сервис: Ошибка поиска поста:', error);
        throw error;
    }
}

//===============  вызвать пост по ID
exports.getPostById = async (id) => {
    try {
        console.log('🔍 Сервис: ищем пост ID:', id);
        console.log('🔍 Сервис: тип ID:', typeof id);

        if (!id) {
            console.log('❌ Сервис: ID поста не передан');
            return null;
        }

        // Убедимся, что id - число
        const postId = parseInt(id);
        if (isNaN(postId)) {
            console.log('❌ Сервис: Неверный формат ID поста:', id);
            return null;
        }

        console.log('🔄 Сервис: Выполняем запрос к БД...');
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
        });

        console.log('✅ Сервис: запрос выполнен');
        console.log('✅ Сервис: пост найден:', post ? post.title : 'null');
        console.log('🖼️ Сервис: изображения:', post ? post.images : 'null');
        
        return post;

    } catch (error) {
        console.error('❌ Сервис: ошибка поиска поста:', error);
        console.error('❌ Сервис: Stack trace:', error.stack);
        throw error;
    }
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
// exports.addPostImage = async (postId, imageUrl, imageOrder = 0) => {
//     const postImage = await bd.post_image.create({
//         data: {
//             image_url: imageUrl,
//             image_order: imageOrder,
//             post_id: parseInt(postId)
//         }
//     })
//     return postImage
// }

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



// ======= ДЛЯ АДМИНКИ =======

//=============== получить все посты для админки
exports.getAllPostsForAdmin = async () => {
    try {
        // console.log('🔄 [SERVICE] Получаем все посты для админки...');

        const posts = await bd.post.findMany({
            include: {
                images: {
                    orderBy: { image_order: 'asc' }
                },
                user_post_ship: {
                    select: {
                        id: true,
                        login: true
                    }
                },
                post_category_ship: {
                    select: {
                        // id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        // console.log(`✅ [SERVICE] Найдено ${posts.length} постов`);
        return posts;

    } catch (error) {
        console.error('❌ [SERVICE] Ошибка получения постов для админки:', error);
        throw new Error(error.message);
    }
};

//=============== обновить статус поста
exports.updatePostStatus = async (postId, status) => {
    try {
        console.log('🔄 [SERVICE] Обновление статуса поста:', { postId, status });

        const parsedPostId = parseInt(postId);
        if (isNaN(parsedPostId)) {
            throw new Error(`Неверный формат ID поста: ${postId}`);
        }

        // Валидация статуса для enum (используем правильные значения)
        const validStatuses = ['Expectation', 'Published', 'Rejected'];
        if (!validStatuses.includes(status)) {
            throw new Error(`Неверный статус: ${status}. Допустимые значения: ${validStatuses.join(', ')}`);
        }

        console.log('📝 [SERVICE] Выполняем запрос к БД...');

        const updatedPost = await bd.post.update({
            where: { id: parsedPostId },
            data: {
                status: status // Передаем значение с заглавной буквы
            },
            include: {
                images: true,
                user_post_ship: {
                    select: {
                        id: true,
                        login: true
                    }
                },
                post_category_ship: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        console.log('✅ [SERVICE] Пост успешно обновлен:', updatedPost);
        return updatedPost;

    } catch (error) {
        console.error('❌ [SERVICE] Ошибка обновления статуса:', error);

        if (error.code === 'P2025') {
            throw new Error(`Пост с ID ${postId} не найден`);
        }

        throw new Error(`Ошибка базы данных: ${error.message}`);
    }
};