import React from 'react'
import '../css/Authorization.css'
import { Link, useNavigate } from 'react-router-dom'; // Добавьте useNavigate
import { useState } from 'react';
import { autoUser } from '../api/users.api'
import Alert from '../components/Alert';
import { useAlert } from '../components/UI/alert'; 

export default function Auth() {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    })
    const navigate = useNavigate(); // Используйте navigate вместо window.location

    const { alert, showActionAlert, closeAlert } = useAlert();

    const onInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.login || !formData.password) {
            showActionAlert('login_empty_fields', 'warning');
            return;
        }
        try {
            const result = await autoUser(formData.login, formData.password); 

            if (result.token) {
                localStorage.setItem('token', result.token);

                try {
                    const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
                    const userRole = tokenPayload.role;
                    
                    
                        if (userRole === 'Admin') {
                            navigate('/adminUsers');
                        } else {
                            navigate('/posts');
                        }
                    
                    
                } catch (decodeError) {
                    console.error('Ошибка декодирования токена:', decodeError);
                    showActionAlert('error_generic', 'error', { message: 'Ошибка обработки токена' });
                }

            } else {
                showActionAlert('login_error', 'error');
            }

        } catch (error) {
            console.error('Ошибка авторизации:', error);
            // Используем сообщение из ошибки или общее сообщение
            if (error.message) {
                showActionAlert('error_generic', 'error', { message: error.message });
            } else {
                showActionAlert('login_error', 'error');
            }
        } 
    }

    return (
        <>
            <div className="body">
                <Alert 
                    isOpen={alert.isOpen}
                    text={alert.text}
                    type={alert.type}
                    onClose={closeAlert}
                />
                <div className="Auth">
                    <form className='form' onSubmit={handleSubmit}>
                        <h1 className='title'>Авторизация пилота</h1>
                        <input 
                            className='login' 
                            name='login' 
                            type="text" 
                            placeholder='Логин' 
                            value={formData.login} 
                            onChange={onInputChange} 
                            required 
                        />
                        <input 
                            className='password' 
                            name='password' 
                            type="password" 
                            placeholder='Пароль' 
                            value={formData.password} 
                            onChange={onInputChange} 
                            required 
                        />
                        <div className="button">
                            <button 
                                className='btn' 
                                type="submit"
                            >
                                Полетели!
                            </button>
                        </div>
                        <p className='already'>Нет аккаунта? <Link to="/registration" className='link_already'>Зарегистрироваться</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}