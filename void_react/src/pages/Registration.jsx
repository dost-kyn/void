import React from 'react'
import '../css/Authorization.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validateRegistration } from '../components/UI/auth/registr';
import { registerUser } from '../api/users.api.js';

import { useFilter } from '../components/UI/posts/filter'

export default function Registration() {
    // категории 
        const {
            sostFilter,
            OpenFilter,
            CloseFilter,
            categories,
            categoriesLoading,
            categoriesError,
            selectedCategories,
            handleCategorySelect,
            clearFilter,
            applyFilter
        } = useFilter()


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
        setIsLoading(true);

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

    // ✅ Получаем названия выбранных категорий
    const getSelectedCategoryNames = () => {
        return selectedCategories.map(catId => {
            const category = categories.find(cat => cat.id === catId);
            return category ? category.name : '';
        }).filter(name => name !== '');
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

                        <div className="Posts_tools_filter">
                            <button 
                                type="button" 
                                className="Reg_category_btn" 
                                onClick={OpenFilter}
                                disabled={selectedCategories.length >= 3} 
                            >
                                {selectedCategories.length === 0 
                                    ? 'Выберите категории' 
                                    : `Выбрано ${selectedCategories.length}/3 категорий`
                                }
                            </button>

                            {/* Фильтр */}
                            {sostFilter && (
                                <div className="Reg_category_modal">
                                    <div className="filter_modal_close_container">
                                        <h3 className="Reg_category_modal_close_h3">
                                            Категории ({selectedCategories.length}/3)
                                        </h3>
                                        <button className='filter_modal_close' onClick={CloseFilter}>✘</button>
                                    </div>

                                    <div className="filter_modal_punkts">
                                        {categoriesLoading ? (
                                            <div className="loading">Загрузка категорий...</div>
                                        ) : categoriesError ? (
                                            <div className="error">{categoriesError}</div>
                                        ) : (
                                            categories.map(category => (
                                                <div key={category.id} className="filter_modal_punkt">
                                                    <input
                                                        type="checkbox"
                                                        className="filter_modal_punkt_inp"
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategorySelect(category.id)}
                                                        disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category.id)} // ✅ Блокируем новые выборы при лимите
                                                    />
                                                    <p className="Reg_category_modal_punkt_p">{category.name}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>




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