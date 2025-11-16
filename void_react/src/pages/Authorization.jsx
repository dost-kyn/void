import React from 'react'
import '../css/Authorization.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { autoUser } from '../api/users.api'

export default function Auth() {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    })
    const [error, setError] = useState({})


    const onInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Очищаем ошибку при вводе
        if(error[name]){
            setError(prev =>({
                ...prev,
                [name] : ''
            }))
        }
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        try{
            const result = await autoUser({
                login: formData.login,
                password: formData.password
            })

            if (result.token){
                localStorage.setItem('token', result.token);
                

                try {
                    const tokenPayload = JSON.parse(atob(result.token.split('.')[1]));
                    const userRole = tokenPayload.role;
                    
                    alert('Авторизация успешна!');
                    
                    if (userRole === 'Admin') {
                        window.location.href = '/adminUsers';
                    } else {
                        window.location.href = '/posts';
                    }
                } catch (decodeError) {
                    console.error('Ошибка декодирования токена:', decodeError);
                    setError({ general: 'Ошибка обработки токена' });
                }

            } else {
                setError({ general: result.message || 'Ошибка авторизации' });
            }

        } catch (error){
            console.error('Ошибка авторизации:', error);
            setError({ general: 'Произошла ошибка при авторизации' });
        } 
    }

    return (
        <>
            <div className="body">
                <div className="Auth">
                    <form className='form' onSubmit={handleSubmit}>
                        <h1 className='title'>Авторизация пилота</h1>
                        <input className='login' name='login' type="text" placeholder='Логин' value={formData.login} onChange={onInputChange} required />
                        <input className='password' name='password' type="password" placeholder='Пароль' value={formData.password} onChange={onInputChange} required />
                        <div className="button">
                            <button className='btn'>Полетели!</button>
                        </div>
                        <p className='already'>Нет аккаунта? <Link to="/registration" className='link_already'>Зарегистрироваться</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
