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
    if(password !== repeatPassword){// bcrypt.compare не нужен, т.к пароли еще не хэшированы
        return "Пароли не совпали"
    }
    return null
}

exports.GetUsersByEmail = async (email) => {
    const user = await bd.user.findUnique({  // это правильный синтаксис Prisma
        where: { email: email }
    })

    if(user){
        return "Пользователь с таким email уже существует"
    } 
    return null
}

exports.GetUsersByLogin = async (login) => {
    const user = await bd.user.findUnique({
        where: {login: login}
    })
    if(user){
        return "Пользователь с таким логином уже существует"
    }
    return null
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
    if(!user) return "Пользователь не найден"
    
    const isValidPassword = await bcrypt.compare(password, user.password) 
    if(!isValidPassword) return "Неверный пароль"
    
    return null
}

exports.findUserByLogin = async (login) => {
    return await bd.user.findUnique({
        where: { login: login }
    })
}
//===============  авторизация конец


