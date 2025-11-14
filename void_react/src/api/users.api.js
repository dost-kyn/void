const API_URL = 'http://localhost:5000/api';

// Регистрация
export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    return await response.json();
};


// Авторизация
export const autoUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        body: JSON.stringify(userData)
    })
    return await response.json()
}

// Получить всех пользователей
export const getAllUsers = async() => {
    const response = await fetch(`${API_URL}/users/`)
    return await response.json();
}