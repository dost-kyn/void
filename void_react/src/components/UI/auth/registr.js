import { useState } from "react";

// Валидация имени и фамилии (только буквы, дефис и пробелы)
export const validateName = (name) => {
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
    return nameRegex.test(name);
};

// Валидация email
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Валидация логина (только латиница)
export const validateLoginFormat = (login) => {
    const loginRegex = /^[A-Za-z0-9_]+$/;
    return loginRegex.test(login);
};

// Проверка уникальности логина (имитация запроса к серверу)
export const checkLoginUnique = async (login) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // В реальном приложении здесь будет запрос к API
            const existingLogins = ['admin', 'user', 'test'];
            resolve(!existingLogins.includes(login));
        }, 500);
    });
};

// Валидация пароля
export const validatePassword = (password) => {
    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов';
    }
    return '';
};

// Основная функция валидации
export const validateRegistration = async (formData) => {
    const errors = {};

    console.log('Валидация данных:', formData);

    // Валидация имени
    if (!formData.firstName.trim()) {
        errors.firstName = 'Имя обязательно для заполнения';
    } else if (!validateName(formData.firstName)) {
        errors.firstName = 'Имя может содержать только буквы, дефис и пробелы';
    }

    // Валидация фамилии
    if (!formData.surname.trim()) {
        errors.surname = 'Фамилия обязательна для заполнения';
    } else if (!validateName(formData.surname)) {
        errors.surname = 'Фамилия может содержать только буквы, дефис и пробелы';
    }

    // Валидация логина
    if (!formData.login.trim()) {
        errors.login = 'Логин обязателен для заполнения';
    } else if (!validateLoginFormat(formData.login)) {
        errors.login = 'Логин может содержать только латинские буквы, цифры и подчеркивания';
    } else {
        // Проверка уникальности логина
        try {
            const isUnique = await checkLoginUnique(formData.login);
            if (!isUnique) {
                errors.login = 'Этот логин уже занят';
            }
        } catch (error) {
            errors.login = 'Ошибка проверки логина';
        }
    }

    // Валидация email
    if (!formData.email.trim()) {
        errors.email = 'Email обязателен для заполнения';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Введите корректный email адрес';
    }

    // Валидация пароля
    if (!formData.password) {
        errors.password = 'Пароль обязателен для заполнения';
    } else {
        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            errors.password = passwordError;
        }
    }

    // Валидация повторного пароля
    if (!formData.repeatPassword) {
        errors.repeatPassword = 'Повторите пароль';
    } else if (formData.password !== formData.repeatPassword) {
        errors.repeatPassword = 'Пароли не совпадают';
    }

    // Валидация согласия
    if (!formData.agree) {
        errors.agree = 'Необходимо согласие на обработку персональных данных';
    }

    console.log('Найдены ошибки:', errors);
    return errors;
};