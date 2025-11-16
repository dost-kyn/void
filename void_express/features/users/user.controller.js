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
    const { name, last_name, login, email, password, repeatPassword } = req.body;

    const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

    const VerifyCreateUser = await UserService.VerifyCreateUser(
        name, last_name, login, email, password, repeatPassword
    );

    const VerifyPasswords = await UserService.VerifyPasswords(password, repeatPassword);
    const GetUsersByEmail = await UserService.GetUsersByEmail(email);
    const GetUsersByLogin = await UserService.GetUsersByLogin(login);

    if (VerifyCreateUser) return res.status(400).json({ message: VerifyCreateUser });
    if (VerifyPasswords) return res.status(400).json({ message: VerifyPasswords });
    if (GetUsersByEmail) return res.status(400).json({ message: GetUsersByEmail });
    if (GetUsersByLogin) return res.status(400).json({ message: GetUsersByLogin });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserService.createUser({
        name, last_name, login, email, hashedPassword, avatar: avatarPath
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

    res.status(200).json({ message: "Пользователь зарегистрирован", token });

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
    const { id } = req.params

    const user = await UserService.findUserById(id)
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' })
    }

    await UserService.delProfileId(id);

    res.status(200).json(userWithoutPassword);
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
