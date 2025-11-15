const { message } = require("../../utils/configuration.prisma");
const UserService = require("./user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getAllUsers = async (req, res, next) => {
    const users = await UserService.getAllUsers();
    if (users.length <= 0) {
        const error = new Error("Пользователи не найдены");
        error.status = 404;
        return next(error);
    }
    res.status(200).json(users);
};





exports.createUser = async (req, res, next) => {
    const { name, last_name, login, email, password, repeatPassword, avatar } = req.body;

    const VerifyCreateUser = await UserService.VerifyCreateUser(
        name,
        last_name,
        login,
        email,
        password,
        repeatPassword
    );

    const VerifyPasswords = await UserService.VerifyPasswords(
        password,
        repeatPassword
    );
    const GetUsersByEmail = await UserService.GetUsersByEmail(email);
    const GetUsersByLogin = await UserService.GetUsersByLogin(login);

    if (VerifyCreateUser) return res.status(400).json({ message: VerifyCreateUser });
    if (VerifyPasswords) return res.status(400).json({ message: VerifyPasswords });
    if (GetUsersByEmail) return res.status(400).json({ message: GetUsersByEmail });
    if (GetUsersByLogin) return res.status(400).json({ message: GetUsersByLogin });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserService.createUser({
        name, last_name, login, email, hashedPassword, avatar
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





exports.loginUsers = async (req, res, next) => {
    const { login, password } = req.body;


    // const passwordNoHash = bcrypt.hashSync(password); // - првоерить

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



