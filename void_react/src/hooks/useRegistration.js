// hooks/useRegistration.js
import { useState } from 'react';
import { validateRegistration } from '../components/UI/auth/registr';
import { registerUser } from '../api/users.api.js';
import { useFilter } from '../components/UI/posts/filter';

// Обработчик изменения файла аватара
export const handleFileChange = (e, setPreview, setFormData) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setFormData(prev => ({
            ...prev,
            avatar: file
        }));
    }
};

// Обработчик изменения полей формы
export const handleChange = (e, formData, setFormData, errors, setErrors) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    // Очищаем ошибку при вводе
    if (errors[name]) {
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    }
};

// Обработчик отправки формы
export const handleSubmit = async (e, formData, selectedCategories, setErrors, setLoading) => {
    e.preventDefault();
    setLoading(true);

    try {
        const validationErrors = await validateRegistration(formData);

        if (Object.keys(validationErrors).length === 0) {
            console.log('Регистрация успешна! Данные:', formData);

            // FORMDATA ДЛЯ ОТПРАВКИ ФАЙЛА
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.firstName);
            formDataToSend.append('last_name', formData.surname);
            formDataToSend.append('login', formData.login);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('repeatPassword', formData.repeatPassword);

            // Добавляем выбранные категории
            selectedCategories.forEach(categoryId => {
                formDataToSend.append('categories[]', categoryId);
            });

            if (formData.avatar) {
                formDataToSend.append('avatar', formData.avatar);
            }

            const result = await registerUser(formDataToSend);

            if (result.token) {
                localStorage.setItem('token', result.token);
                window.location.href = '/posts';
            } else {
                setErrors({ general: result.message || 'Ошибка регистрации' });
            }
        } else {
            setErrors(validationErrors);
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        setErrors({ general: 'Произошла ошибка при регистрации' });
    } finally {
        setLoading(false);
    }
};

// Получение названий выбранных категорий
export const getSelectedCategoryNames = (selectedCategories, categories) => {
    return selectedCategories.map(catId => {
        const category = categories.find(cat => cat.id === catId);
        return category ? category.name : '';
    }).filter(name => name !== '');
};

// Функция для сброса формы
export const resetForm = (setFormData, setPreview, setErrors) => {
    setFormData({
        firstName: '',
        surname: '',
        login: '',
        email: '',
        password: '',
        repeatPassword: '',
        category: '',
        avatar: null,
        agree: false
    });
    setPreview(null);
    setErrors({});
};

// Хук для управления состоянием регистрации
export const useRegistration = () => {
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        surname: '',
        login: '',
        email: '',
        password: '',
        repeatPassword: '',
        category: '',
        avatar: null,
        agree: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Используем хук фильтра для категорий
    const {
        sostFilter,
        OpenFilter,
        CloseFilter,
        categories,
        categoriesError,
        selectedCategories,
        handleCategorySelect,
        clearFilter,
        applyFilter
    } = useFilter();

    return {
        // Состояния
        preview,
        formData,
        errors,
        loading,

        // Функции состояния
        setPreview,
        setFormData,
        setErrors,
        setLoading,

        // Функции фильтра
        sostFilter,
        OpenFilter,
        CloseFilter,
        categories,
        categoriesError,
        selectedCategories,
        handleCategorySelect,
        clearFilter,
        applyFilter
    };
};