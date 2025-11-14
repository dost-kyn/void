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

    return (
        <>
            <div className="body">
                <div className="Auth">
                    <form className='form' action="">
                        <h1 className='title'>Авторизация пилота</h1>
                        <input className='login' type="text" placeholder='Логин' required />
                        <input className='email' type="email" placeholder='Email' required />
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
