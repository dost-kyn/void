import React from 'react'
import '../../css/Admin_panel.css'
import { useState } from 'react';
import Naw_Admin_panel from '../../components/Naw_Admin_panel'

export default function AdminUsers() {
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Иосиф',
            surname: 'Сталин',
            login: 'Stalin_I',
            email: 'Stalin@mail.ru',
            categories: 'Котики, Новости, Романтика',
            date: '12.09.22',
            isBanned: false
        },
        {
            id: 2,
            name: 'Иосиф',
            surname: 'Сталин',
            login: 'Stalin_I',
            email: 'Stalin@mail.ru',
            categories: 'Котики, Новости, Романтика',
            date: '12.09.22',
            isBanned: true
        }
    ]);

    // Функция для бана/разбана
    const toggleBan = (userId) => {
        setUsers(users.map(user =>
            user.id === userId
                ? { ...user, isBanned: !user.isBanned }
                : user
        ));
    };
    return (
        <>
            <div className="body">
                <Naw_Admin_panel />

                <div className="AdminUsers">
                    <h1 className="adminUsers_title">Пользователи</h1>
                    <div className="adminUsers_content">
                        <table className='table_users'>
                            <thead>
                                <tr>
                                    <th>Имя</th>
                                    <th>Фамилия</th>
                                    <th>Логин</th>
                                    <th>Email</th>
                                    <th>Категории</th>
                                    <th>Дата регистрации</th>
                                    <th>Бан</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>Иосиф</td>
                                        <td>Сталин</td>
                                        <td>Stalin_I</td>
                                        <td>Stalin@mail.ru</td>
                                        <td>Котики, Новости, Романтика</td>
                                        <td>12.09.22</td>
                                        <td>
                                            <button className={`ban_btn ${user.isBanned ? 'unban' : 'ban'}`}
                                                onClick={() => toggleBan(user.id)}>
                                                {user.isBanned ? 'Не бан' : 'Бан'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}