import React from 'react'
import '../../css/Admin_panel.css'
import { useState, useEffect } from 'react';
import Naw_Admin_panel from '../../components/Naw_Admin_panel'



import { getAllUsers } from '../../api/users.api'

export default function AdminUsers() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        AllUsers()
    }, [])

    const AllUsers = async () => {
        try {
            const result = await getAllUsers()
            setUsers(result)
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error)
        }
    }



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
                                        <td>{user.name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.login}</td>
                                        <td>{user.email}</td>
                                        <td>Котики, Новости, Романтика</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
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