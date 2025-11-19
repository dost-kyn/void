// pages/admin_panel/AdminUsers.js
import React from 'react'
import '../../css/Admin_panel.css'
import { useState, useEffect } from 'react';
import Naw_Admin_panel from '../../components/Naw_Admin_panel'
import { getAllUsers } from '../../api/users.api'
import { useAlert } from '../../components/UI/alert';
import { useUserManagement } from '../../hooks/admin/useUserManagement';
import Alert from '../../components/Alert';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const { showActionAlert, alert, closeAlert } = useAlert();
    const { loading, handleBanUser, handleUnbanUser } = useUserManagement(showActionAlert);

    useEffect(() => {
        AllUsers();
    }, []);

    const AllUsers = async () => {
        try {
            const result = await getAllUsers();
            setUsers(result);
        } catch (error) {
            console.error('Ошибка загрузки пользователей:', error);
        }
    };

    // Функция для бана/разбана
    const toggleBan = async (user) => {
        const success = user.status === 'Ban' 
            ? await handleUnbanUser(user.id, user.login)
            : await handleBanUser(user.id, user.login);
        
        if (success) {
            await AllUsers();
        }
    };

    return (
        <>
            <div className="body">
                <Naw_Admin_panel />
                <Alert 
                    isOpen={alert.isOpen}
                    text={alert.text}
                    type={alert.type}
                    onClose={closeAlert}
                />

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
                                    <th>Статус</th>
                                    <th>Дата регистрации</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.login}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`status-badge ${user.status === 'Ban' ? 'banned' : 'active'}`}>
                                                {user.status === 'Ban' ? 'Забанен' : 'Активен'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className={`ban_btn ${user.status === 'Ban' ? 'unban' : 'ban'}`}
                                                onClick={() => toggleBan(user)}
                                                disabled={loading}
                                            >
                                                {user.status === 'Ban' ? 'Разбан' : 'Бан'}
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