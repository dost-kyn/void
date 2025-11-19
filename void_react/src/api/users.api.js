const API_URL = 'http://localhost:5000/api';

// Регистрация
export const registerUser = async (formData) => {
    const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        body: formData,
    });
    return await response.json();
};


// Авторизация
export const autoUser = async (login, password) => {
    try {
        console.log('Отправляю данные:', { login, password });
        
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        });
        
        if (!response.ok) {
            let errorMessage = 'Ошибка при авторизации';
            
            try {
                // Пытаемся получить JSON с ошибкой
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || `Ошибка: ${response.status}`;
            } catch (jsonError) {
                // Если не получается распарсить JSON, используем статус
                if (response.status === 400) {
                    errorMessage = 'Неверный логин или пароль';
                } else if (response.status === 404) {
                    errorMessage = 'Пользователь не найден';
                } else {
                    errorMessage = `Ошибка сервера: ${response.status}`;
                }
            }
            
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Ошибка при авторизации:', error);
        throw error;
    }
};

// Получить всех пользователей
export const getAllUsers = async() => {
    const response = await fetch(`${API_URL}/users/`)
    return await response.json();
}



// Найти рользователя по id
export const findUser = async(userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`)
    return await response.json()
}



// удаление профиля
export const delProfile = async(userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE'
    })
    return await response.json()
}


// Обновление данных пользователя
export const updateUser = async (userId, updateData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    });
    return await response.json();
};

// Для обновления с файлом (аватар)
export const updateUserWithPhoto = async (userId, formData) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData // FormData сам установит Content-Type с boundary
    });
    return await response.json();
};