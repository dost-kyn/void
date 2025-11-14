import React from 'react'
import '../css/Authorization.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateRegistration } from '../components/UI/auth/registr';
import { registerUser } from '../api/users.api.js';

export default function Registration() {
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
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
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

    const handleChange = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Данные формы:', formData);
        setIsLoading(true);

        try {
            const validationErrors = await validateRegistration(formData);
            console.log('Ошибки валидации:', validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                console.log('Регистрация успешна! Данные:', formData);

                const result = await registerUser({
                    name: formData.firstName,
                    last_name: formData.surname,
                    login: formData.login,
                    email: formData.email,
                    password: formData.password,
                    repeatPassword: formData.repeatPassword,
                    avatar: formData.avatar 
                });

                console.log('Ответ сервера:', result);
                if (result.token) {
                    alert('Регистрация успешна!');
                    // Сохраняем токен
                    localStorage.setItem('token', result.token);
                    // Перенаправляем на главную или в кабинет
                    window.location.href = '/posts';
                } else {
                    setErrors({ general: result.message || 'Ошибка регистрации' });
                }

            }
            else {
                setErrors(validationErrors);
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            setErrors({ general: 'Произошла ошибка при регистрации' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="body">
                <div className="Auth">
                    <form className='form' onSubmit={handleSubmit}>
                        <h1 className='title'>Регистрация пилота</h1>

                        {/* Имя */}
                        <input
                            className={`firstName ${errors.firstName ? 'error' : ''}`}
                            type="text"
                            name="firstName"
                            placeholder='Имя'
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && <div className="error_message">{errors.firstName}</div>}

                        {/* Фамилия */}
                        <input
                            className={`surname ${errors.surname ? 'error' : ''}`}
                            type="text"
                            name="surname"
                            placeholder='Фамилия'
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />
                        {errors.surname && <div className="error_message">{errors.surname}</div>}

                        {/* Логин */}
                        <input
                            className={`login ${errors.login ? 'error' : ''}`}
                            type="text"
                            name="login"
                            placeholder='Логин'
                            value={formData.login}
                            onChange={handleChange}
                            required
                        />
                        {errors.login && <div className="error_message">{errors.login}</div>}

                        {/* Email */}
                        <input
                            className={`email ${errors.email ? 'error' : ''}`}
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <div className="error_message">{errors.email}</div>}

                        {/* Пароль */}
                        <input
                            className={`password ${errors.password ? 'error' : ''}`}
                            type="password"
                            name="password"
                            placeholder='Пароль'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <div className="error_message">{errors.password}</div>}

                        {/* Повтор пароля */}
                        <input
                            className={`repeatPassword ${errors.repeatPassword ? 'error' : ''}`}
                            type="password"
                            name="repeatPassword"
                            placeholder='Повторите пароль'
                            value={formData.repeatPassword}
                            onChange={handleChange}
                            required
                        />
                        {errors.repeatPassword && <div className="error_message">{errors.repeatPassword}</div>}

                        {/* Категории */}
                        <p className='p_select'>Выбор интересующих категорий (не обязательно)</p>
                        <select
                            className='categories'
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {/* <option value="">Выберите категорию</option> */}
                            <option value="sport">Спорт</option>
                            <option value="music">Музыка</option>
                            <option value="art">Рисование</option>
                        </select>

                        {/* Аватар */}
                        <p className='p_select2'>Фото профиля (не обязательно)</p>
                        <div className="avatar_upload">
                            <label className="file_input_label">
                                Выберите файл
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="file_input"
                                    name="avatar"
                                />
                            </label>

                            {preview && (
                                <div className="avatar_preview">
                                    <img src={preview} alt="Avatar preview" />
                                </div>
                            )}
                        </div>

                        {/* Согласие */}
                        <div className="content_checkbox">
                            <input
                                type="checkbox"
                                className={`checkbox ${errors.agree ? 'error' : ''}`}
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChange}
                            />
                            <p className="checkbox_p">Согласие на обработку персональных данных</p>
                        </div>
                        {errors.agree && <div className="error_message">{errors.agree}</div>}

                        {/* Общие ошибки */}
                        {errors.general && <div className="error_message general_error">{errors.general}</div>}

                        {/* Кнопка отправки */}
                        <div className="button">
                            <button
                                className='btn'
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Загрузка...' : 'Запуск!'}
                            </button>
                        </div>

                        <p className='already'>У вас уже есть аккаунт? <Link to="/authorization" className='link_already'>Авторизироваться</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}