
export const useGetUserIdFromToken = () => {
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.id;
            } catch (error) {
                console.error('useGetUserIdFromToken: Ошибка парсинга токена:', error);
                return null;
            }
        } else {
            console.log('useGetUserIdFromToken: Токен не найден в localStorage');
            return null;
        }
    };

    return { getUserIdFromToken };
};