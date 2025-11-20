const { message } = require("../../utils/configuration.prisma");
const UserService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



//===============  вызвать всех
exports.getAllUsers = async (req, res, next) => {
    const users = await UserService.getAllUsers();
    if (users.length <= 0) {
        const error = new Error("Пользователи не найдены");
        error.status = 404;
        return next(error);
    }
    res.status(200).json(users);
};

//===============  регистрация
exports.createUser = async (req, res, next) => {
    try {
        const { name, last_name, login, email, password, repeatPassword, categories } = req.body;
        const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

        console.log('📨 Регистрация - полученные данные:', {
            name, last_name, login, email,
            categories: categories || 'не указаны'
        });

        // Обработка категорий
        let categoryIds = [];
        if (categories) {
            if (Array.isArray(categories)) {
                categoryIds = categories.map(id => parseInt(id)).filter(id => !isNaN(id));
            } else if (typeof categories === 'string') {
                categoryIds = [parseInt(categories)].filter(id => !isNaN(id));
            }
        }

        console.log('🎯 Обработанные категории:', categoryIds);

        // Валидации - УБРАЛ categories из вызова VerifyCreateUser
        const VerifyCreateUser = await UserService.VerifyCreateUser(
            name, last_name, login, email, password, repeatPassword
            // categories больше не передаем сюда
        );
        const VerifyPasswords = await UserService.VerifyPasswords(password, repeatPassword);
        const GetUsersByEmail = await UserService.GetUsersByEmail(email);
        const GetUsersByLogin = await UserService.GetUsersByLogin(login);

        if (VerifyCreateUser) return res.status(400).json({ message: VerifyCreateUser });
        if (VerifyPasswords) return res.status(400).json({ message: VerifyPasswords });
        if (GetUsersByEmail) return res.status(400).json({ message: GetUsersByEmail });
        if (GetUsersByLogin) return res.status(400).json({ message: GetUsersByLogin });

        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаем пользователя с категориями
        const newUser = await UserService.createUser({
            name,
            last_name,
            login,
            email,
            hashedPassword,
            avatar: avatarPath,
            categories: categoryIds
        });

        const token = jwt.sign(
            {
                id: newUser.id,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "5h",
            }
        );

        console.log('✅ Пользователь зарегистрирован с категориями:', newUser.id_category);

        res.status(200).json({
            message: "Пользователь зарегистрирован",
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                login: newUser.login,
                categories: newUser.id_category
            }
        });

    } catch (error) {
        console.error('❌ Ошибка регистрации:', error);

        if (error.code === 'P2025') {
            return res.status(400).json({ message: "Одна из выбранных категорий не найдена" });
        }

        res.status(500).json({ message: "Ошибка сервера при регистрации" });
    }
};




//===============  авторизация
exports.loginUsers = async (req, res, next) => {
    const { login, password } = req.body;

    const VerifyAuto = await UserService.VerifyAuto(login, password);
    if (VerifyAuto) return res.status(400).json({ message: VerifyAuto });

    const user = await UserService.findUserByLogin(login) // Находим массив пользователя по логину

    const passwordError = await UserService.AutoPasswords(user, password);

    if (passwordError) {
        return res.status(400).json({ message: passwordError });
    }


    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "5h"
        }
    );

    res.status(200).json({ message: "Пользователь Вошли", token });
};



//===============  найти пользователя по id
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params; // ID из URL

        const user = await UserService.findUserById(id);

        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        // возвращаем user но без пароля!
        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;

        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('❌ Ошибка в getUserById:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



//===============  удаление профиля
exports.delProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('🗑️ Сервер: Удаление профиля ID:', id);

        // Проверяем существование пользователя
        const user = await UserService.findUserById(id);
        if (!user) {
            console.log('❌ Сервер: Пользователь не найден');
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        console.log('✅ Сервер: Пользователь найден, удаляем...');
        
        // Удаляем пользователя
        await UserService.delProfileId(id);

        console.log('✅ Сервер: Пользователь удален');

        // Возвращаем успешный ответ
        res.status(200).json({ 
            message: 'Профиль успешно удален',
            deletedUser: { id: user.id, login: user.login }
        });

    } catch (error) {
        console.error('❌ Сервер: Ошибка при удалении профиля:', error);
        
        // Проверяем тип ошибки
        if (error.code === 'P2003') {
            // Ошибка foreign key constraint (если используется Prisma)
            return res.status(400).json({ 
                message: 'Нельзя удалить профиль. Сначала удалите связанные посты или другие данные.' 
            });
        }
        
        res.status(500).json({ 
            message: 'Ошибка сервера при удалении профиля',
            error: error.message 
        });
    }
}




//===============  изменения данных
exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        console.log('Обновление пользователя:', userId, updateData);
        console.log('Файл:', req.file);

        // Если есть файл, добавляем путь к аватару
        if (req.file) {
            updateData.avatar = '/uploads/' + req.file.filename;
        }

        const updatedUser = await UserService.updateUser(userId, updateData);

        res.status(200).json({
            message: "Данные обновлены",
            user: updatedUser
        });
    } catch (error) {
        console.error('Ошибка в updateUser:', error);
        res.status(500).json({ message: "Ошибка обновления: " + error.message });
    }
};




//=============== Бан пользователя
exports.banUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const bannedUser = await UserService.banUserById(id);

        res.status(200).json({ 
            message: 'Пользователь забанен',
            user: bannedUser 
        });

    } catch (error) {
        console.error('Ошибка при бане пользователя:', error);
        res.status(500).json({ 
            message: 'Ошибка при бане пользователя',
            error: error.message 
        });
    }
};

//=============== Разбан пользователя
exports.unbanUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await UserService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        const unbannedUser = await UserService.unbanUserById(id);

        res.status(200).json({ 
            message: 'Пользователь разбанен',
            user: unbannedUser 
        });

    } catch (error) {
        console.error('Ошибка при разбане пользователя:', error);
        res.status(500).json({ 
            message: 'Ошибка при разбане пользователя',
            error: error.message 
        });
    }
};



exports.getUserCategories = async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🔍 Контроллер: Получаем категории пользователя ID:', userId);
        
        const userCategories = await UserService.getUserCategories(parseInt(userId));
        
        console.log('✅ Контроллер: Категории пользователя получены:', userCategories);
        res.json(userCategories);
    } catch (error) {
        console.error('❌ Контроллер: Ошибка получения категорий пользователя:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Обновить категории пользователя
exports.updateUserCategories = async (req, res) => {
    try {
        const { userId } = req.params;
        const { categories } = req.body;
        
        console.log('🔄 Контроллер: Обновляем категории пользователя ID:', userId);
        console.log('📝 Контроллер: Новые категории:', categories);
        
        const updatedUser = await UserService.updateUserCategories(parseInt(userId), categories);
        
        console.log('✅ Контроллер: Категории пользователя обновлены');
        res.json(updatedUser);
    } catch (error) {
        console.error('❌ Контроллер: Ошибка обновления категорий пользователя:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
