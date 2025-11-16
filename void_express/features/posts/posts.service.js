const bd = require('../../utils/configuration.prisma')

// exports.getAllPosts = async () => {
//     const posts = await bd.posts.findMany()
//     return posts
// }

//===============  вызвать все посты
// exports.getAllPosts = async () => {
//     const posts = await bd.post.findMany({
//         include: {
//             author: {
//                 select: {
//                     login: true,
//                     name: true,
//                     last_name: true
//                 }
//             },
//             category: {
//                 select: {
//                     name: true
//                 }
//             }
//         }
//     })
//     return posts
// }

//===============  вызвать посты пользователя
exports.getUserPosts = async (userId) => {
    const posts = await bd.post.findMany({
        where: { 
            user_id: parseInt(userId)
        },
        include: {
            category_id: {
                select: {
                    name: true
                }
            },
            author: {
                select: {
                    login: true,
                    name: true,
                    last_name: true
                }
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
    if (id) {
        const postId = parseInt(id)
        const post = await bd.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        login: true,
                        name: true,
                        last_name: true,
                        avatar: true
                    }
                },
                category: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return post
    }
    return null
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

//===============  изменение поста
// exports.updatePost = async (id, postData) => {
//     const post = await bd.post.update({
//         where: { id: parseInt(id) },
//         data: {
//             title: postData.title,
//             content: postData.content,
//             categoryId: parseInt(postData.categoryId),
//             image: postData.image || null
//         }
//     })
//     return post
// }

//===============  удаление поста
// exports.findPostId = async (id) => {
//     if (id) {
//         const postId = parseInt(id)
//         const post = await bd.post.findUnique({
//             where: { id: postId }
//         })
//         return post
//     }
//     return null
// }

// exports.deletePost = async (id) => {
//     if (id) {
//         const postId = parseInt(id)
//         const post = await bd.post.delete({
//             where: { id: postId }
//         })
//         return post
//     }
//     return null
// }