const bd = require("../../utils/configuration.prisma");
const bcrypt = require('bcrypt')


//===============  вызвать всех
exports.getAllUsers = async () => {
    const users = await bd.user.findMany();
    return users;
};



//===============  регистрация
exports.createUser = async (userData) => {
const { categories = [], ...userDataWithoutCategories } = userData;
    
    console.log('📝 Создание пользователя с категориями:', { 
        categories, 
        userData: userDataWithoutCategories 
    });

    const user = await bd.user.create({
        data: {
            name: userData.name,
            last_name: userData.last_name,
            login: userData.login,
            email: userData.email,
            password: userData.hashedPassword,
            avatar: userData.avatar,
            // Подключаем категории через связь
            id_category: {
                connect: categories.map(categoryId => ({ id: parseInt(categoryId) }))
            }
        },
        include: {
            id_category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return user;
};

exports.VerifyCreateUser = async (name, last_name, login, email, password, repeatPassword) => {
    if (!name || !last_name || !login || !email || !password || !repeatPassword) {
        return "Введите данные"
    }
    return null
}

exports.VerifyPasswords = async (password, repeatPassword) => {
    if (password !== repeatPassword) {// bcrypt.compare не нужен, т.к пароли еще не хэшированы
        return "Пароли не совпали"
    }
    return null
}

exports.GetUsersByEmail = async (email) => {
    const user = await bd.user.findUnique({
        where: { email: email }
    })

    if (user) {
        return "Пользователь с таким email уже существует"
    }
    return null
}

exports.GetUsersByLogin = async (login) => {
    const user = await bd.user.findUnique({
        where: { login: login }
    })
    if (user) {
        return "Пользователь с таким логином уже существует"
    }
    return null
}
//===============  регистрация конец




//===============  авторизация
exports.VerifyAuto = async (login, password) => {
    if (!password || !login) {
        return "Введите данные"
    }
    return null
}

exports.AutoPasswords = async (user, password) => {
    console.log('AutoPasswords вызвана с:', { user, password });

    if (!user) return "Пользователь не найден"

    if (!user.password) {
        console.log('У пользователя нет пароля:', user);
        return "Ошибка базы данных"
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) return "Неверный пароль"

    return null
}

exports.findUserByLogin = async (login) => {
    return await bd.user.findUnique({
        where: { login: login }
    })
    return user;
}
//===============  авторизация конец



//===============  найти пользователя по id
exports.findUserById = async (id) => {
    const userId = parseInt(id);

    const user = await bd.user.findUnique({
        where: { id: userId },
        include: {
            id_category: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return user;
}



//===============  удаление профиля
exports.delProfileId = async (id) => {
    if (id) {
        const userId = parseInt(id);

        try {
            const result = await bd.$transaction(async (tx) => {
                // 1. Удаляем сообщения пользователя
                await tx.message.deleteMany({
                    where: { sender_id: userId }
                });

                // 2. Удаляем чаты, где пользователь является участником
                await tx.chat.deleteMany({
                    where: {
                        OR: [
                            { user1_id: userId },
                            { user2_id: userId }
                        ]
                    }
                });

                // 3. Удаляем дружеские связи
                await tx.friends.deleteMany({
                    where: {
                        OR: [
                            { user1_id: userId },
                            { user2_id: userId }
                        ]
                    }
                });

                // 4. Удаляем изображения постов и сами посты
                const userPosts = await tx.post.findMany({
                    where: { user_id: userId },
                    select: { id: true }
                });
                
                const postIds = userPosts.map(post => post.id);
                
                if (postIds.length > 0) {
                    await tx.post_image.deleteMany({
                        where: { post_id: { in: postIds } }
                    });
                }

                await tx.post.deleteMany({
                    where: { user_id: userId }
                });

                // 5. Разрываем связи с категориями
                await tx.user.update({
                    where: { id: userId },
                    data: {
                        id_category: {
                            set: []
                        }
                    }
                });

                // 6. Удаляем пользователя
                const deletedUser = await tx.user.delete({
                    where: { id: userId }
                });
                return deletedUser;
            });

            return result;

        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
            throw error;
        }
    }
    return null;
}



//===============  изменения данных
exports.updateUser = async (userId, updateData) => {
    try {
        console.log('Обновление пользователя в сервисе:', userId, updateData);

        // Просто обновляем все полученные данные
        const updatedUser = await bd.user.update({
            where: { id: parseInt(userId) },
            data: updateData
        });
        
        console.log('Пользователь обновлен:', updatedUser);
        return updatedUser;
    } catch (error) {
        console.error('Ошибка в updateUser service:', error);
        throw error;
    }
};



//===============  Бан пользователя
exports.banUserById = async (id) => {
    if (id) {
        const userId = parseInt(id);

        const user = await bd.user.update({
            where: { id: userId },
            data: { 
                status: 'Ban'
            }
        });
        return user;
    }
    return null;
};

//===============  Разбан пользователя
exports.unbanUserById = async (id) => {
    if (id) {
        const userId = parseInt(id);

        const user = await bd.user.update({
            where: { id: userId },
            data: { 
                status: 'Not_banned'
            }
        });
        return user;
    }
    return null;
};