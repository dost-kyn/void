const bd = require("../../utils/configuration.prisma");
const bcrypt = require('bcrypt')

exports.getAllUsers = async () => {
  const users = await bd.user.findMany();
  return users;
};



//===============  регистрация
exports.createUser = async (userData) => {
  const user = await bd.user.create({
    data: {
      name: userData.name,
      last_name: userData.last_name,
      login: userData.login,
      email: userData.email,
      password: userData.hashedPassword,
      avatar: userData.avatar,
    },
  });
  return user;
};

exports.VerifyCreateUser = async (name, last_name, login, email, password, repeatPassword) => {
    if(!name || ! last_name || ! login || !email || !password || !repeatPassword){
        return "Введите данные"
    }
    return null
}

exports.VerifyPasswords = async (password, repeatPassword) => {
    if(!( bcrypt.compare(password, repeatPassword))){
        return "Пароли не совпали"
    }
    return null
}

exports.GetUsersByEmail = async (email) => {
    const user = await bd.user.findFirst(e => e.email === email)
    return user
}

exports.GetUsersByLogin = async (login) => {
    const user = await bd.user.findFirst(e => e.login === login)
    return user
}
//===============  регистрация конец




//===============  авторизация
exports.VerifyAuto = async (login, password) => {
    if(!password || !login){
        return "Введите данные"
    }
    return null
}

exports.AutoPasswords = async (user, password) => {
    if(!user || !( bcrypt.compare(password, user.password))){
        return "Неверный пароль или логин"
    }
    return null
}
