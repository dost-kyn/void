import React from 'react'
import '../../css/Admin_panel.css'
import { useState } from 'react';
import Naw_Admin_panel from '../../components/Naw_Admin_panel'

export default function AdminPosts() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            name: 'Мировое созвание',
            text: 'Состоялся релиз масштабной сюжетной модификации Lordbound для The Elder Scrolls V: Skyrim. Команда энтузиастов занималась разработкой.',
            images: 'image1.jpg, image2.jpg, image3.jpg',
            user: 'Stalin',
            categorie: 'Котики',
            date: '12.09.22',
            status: false
        },
        {
            id: 2,
            name: 'Мировое созвание',
            text: 'Состоялся релиз масштабной сюжетной модификации Lordbound для The Elder Scrolls V: Skyrim. Команда энтузиастов занималась разработкой.',
            images: 'image1.jpg, image2.jpg, image3.jpg',
            user: 'Stalin',
            categorie: 'Новости',
            date: '12.09.22',
            status: true
        }
    ]);

    // Функция для бана/разбана
    const toggleBan = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isBanned: !post.isBanned }
                : post
        ));
    };
    return (
        <>
            <div className="body">
                <Naw_Admin_panel />

                <div className="AdminPosts">
                    <h1 className="adminPosts_title">Посты</h1>
                    <div className="adminPosts_content">
                        <table className='table_posts'>
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Текст</th>
                                    <th>Фотографии</th>
                                    <th>Пользователь</th>
                                    <th>Категория</th>
                                    <th>Дата создание</th>
                                    <th>Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map(post => (
                                    <tr key={post.id}>
                                        <td>Мировое созвание</td>
                                        <td>Состоялся релиз масштабной сюжетной модификации Lordbound для The Elder Scrolls V: Skyrim. Команда энтузиастов занималась разработкой.</td>
                                        <td>image1.jpg, image2.jpg, image3.jpg</td>
                                        <td>Stalin</td>
                                        <td>Новости</td>
                                        <td>12.09.22</td>
                                        <td>
                                            <button className={`ban_btn ${post.isBanned ? 'unban' : 'ban'}`}
                                                onClick={() => toggleBan(post.id)}>
                                                {post.isBanned ? 'Не бан' : 'Бан'}
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