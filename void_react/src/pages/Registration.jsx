import React from 'react'
import '../css/Authorization.css'
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Registration() {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <div className="body">
                <div className="Auth">
                    <form className='form' action="">
                        <h1 className='title'>Регистрация пилота</h1>
                        <input className='firstName' type="text" placeholder='Имя' required />
                        <input className='surname' type="text" placeholder='Фамилия' required />
                        <input className='login' type="text" placeholder='Логин' required />
                        <input className='email' type="email" placeholder='Email' required />
                        <input className='password' type="password" placeholder='Пароль' required />
                        <input className='repeatPassword' type="password" placeholder='Повторите пароль' required />
                        <p className='p_select'>Выбор интересующих категорий (не обязательно)</p>
                        <select className='categories'>
                            <option value="">Новости</option>
                            <option name="" id="">Животные</option>
                            <option name="" id="">Игры</option>
                        </select>
                        <p className='p_select2'>Фото профиля (не обязательно)</p>
                        <div className="avatar_upload">
                            <label className="file_input_label">
                                Выберите файл
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="file_input"
                                />
                            </label>

                            {preview && (
                                <div className="avatar_preview">
                                    <img src={preview} alt="Avatar preview" />
                                </div>
                            )}
                        </div>
                        <div className="content_checkbox">
                            <input type="checkbox" className="checkbox" />
                            <p className="checkbox_p">Согласие на обработку персональных данных</p>
                        </div>
                        <div className="button">
                            <button className='btn'>Запуск!</button>
                        </div>
                        <p className='already'>У вас уже есть аккаунт? <Link to="/authorization" className='link_already'>Авторизироваться</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}
