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
        const userId = parseInt(id)

        const user = await bd.user.delete({
            where: { id: userId }
        })
        return user
    }
    return null
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
