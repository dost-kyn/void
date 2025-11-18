// components/UI/alert/useAlert.js
import { useState, useCallback } from 'react';

export const useAlert = () => {
    const [alert, setAlert] = useState({
        isOpen: false,
        text: '',
        type: 'info'
    });

    // Функция для получения текста по типу действия
    const getAlertText = (action, data = {}) => {
        switch (action) {
            // Авторизация
            case 'login_empty_fields':
                return 'Заполните все поля';
            case 'login_invalid_credentials':
                return 'Неверный логин или пароль';
            case 'login_invalid_data':
                return 'Неверные данные для входа';
            case 'login_user_not_found':
                return 'Пользователь не найден';
            case 'login_error':
                return 'Ошибка при входе в систему';

            // Друзья
            case 'friend_request_sent':
                return 'Заявка в друзья отправлена!';
            case 'friend_request_exists':
                return 'Вы уже отправили заявку этому пользователю';
            case 'friend_request_error':
                return 'Ошибка при отправке заявки';
            case 'friend_request_accepted':
                return 'Заявка в друзья принята!';
            case 'friend_request_rejected':
                return 'Заявка в друзья отклонена';
            
            
            // Посты
            case 'post_created':
                return 'Пост успешно создан!';
            case 'post_updated':
                return 'Пост успешно обновлен!';
            case 'post_deleted':
                return 'Пост удален';
            
            // Профиль
            case 'profile_updated':
                return 'Профиль успешно обновлен!';
            case 'avatar_updated':
                return 'Аватар обновлен';
            

            case 'logout_success':
                return 'Выход выполнен успешно!';
            case 'registration_success':
                return 'Регистрация прошла успешно!';
            
            // Общие
            case 'error_generic':
                return data.message || 'Произошла ошибка';
            case 'success_generic':
                return data.message || 'Операция выполнена успешно';
            case 'warning_generic':
                return data.message || 'Внимание';
            
            default:
                return 'Действие выполнено';
        }
    };

    const showAlert = useCallback((text, type = 'info') => {
        setAlert({
            isOpen: true,
            text,
            type
        });

        // Автоматическое закрытие через 3 секунды
        setTimeout(() => {
            closeAlert();
        }, 3000);
    }, []);

    // Новая функция для показа alert по типу действия
    const showActionAlert = useCallback((action, type = 'info', data = {}) => {
        const text = getAlertText(action, data);
        showAlert(text, type);
    }, [showAlert]);

    const closeAlert = useCallback(() => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    }, []);

    return {
        alert,
        showAlert,
        showActionAlert,
        closeAlert
    };
};