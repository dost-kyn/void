import React from 'react'
import '../../css/Admin_panel.css'
import { useState } from 'react';
import Naw_Admin_panel from '../../components/Naw_Admin_panel'

export default function AdminPosts() {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [posts, setPosts] = useState([
        {
            id: 1,
            name: 'Мировое созвание',
            text: 'Состоялся релиз масштабной сюжетной модификации Lordbound для The Elder Scrolls V: Skyrim. Команда энтузиастов занималась разработкой.',
            images: [
                'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400',
                'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400',
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400'
            ],
            user: 'Stalin',
            categorie: 'Котики',
            date: '12.09.22',
            status: 'pending' // Изменил на строку для селекта
        },
        {
            id: 2,
            name: 'Новости игр',
            text: 'Состоялся релиз масштабной сюжетной модификации Lordbound для The Elder Scrolls V: Skyrim. Команда энтузиастов занималась разработкой.',
            images: [
                'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
                'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400'
            ],
            user: 'Stalin',
            categorie: 'Новости',
            date: '12.09.22',
            status: 'published' // Изменил на строку для селекта
        }
    ]);

    // Функция открытия модального окна поста
    const openPostModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    // Функция закрытия модального окна
    const closePostModal = () => {
        setSelectedPost(null);
        setIsModalOpen(false);
    };

    // Функция изменения статуса поста
    const handleStatusChange = (newStatus) => {
        if (selectedPost) {
            console.log(`Изменен статус поста ${selectedPost.id} на: ${newStatus}`);

            // Обновляем локальное состояние
            setSelectedPost({
                ...selectedPost,
                status: newStatus
            });

            // Обновляем также в основном массиве постов
            setPosts(posts.map(post =>
                post.id === selectedPost.id
                    ? { ...post, status: newStatus }
                    : post
            ));
        }
    };

    const toggleBan = (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, status: !post.status }
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
                                    <tr
                                        key={post.id}
                                        onClick={() => openPostModal(post)}
                                        style={{ cursor: 'pointer' }}
                                        className="post_table_row"
                                    >
                                        <td>{post.name}</td>
                                        <td>{post.text.substring(0, 50)}...</td>
                                        <td>{post.images.length} фото</td> {/* Изменил отображение */}
                                        <td>{post.user}</td>
                                        <td>{post.categorie}</td>
                                        <td>{post.date}</td>
                                        <td>
                                            <select
                                                className={`status_select ${post.status}`}
                                                value={post.status}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(post.id, e.target.value);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="pending">Ожидание</option>
                                                <option value="published">Опубликован</option>
                                                <option value="cancelled">Отменен</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && selectedPost && (
                        <>
                            <div className="modal_overlay" onClick={closePostModal}>
                                <div className="post_view_modal" onClick={(e) => e.stopPropagation()}>
                                    <h1 className="post_view_title">{selectedPost.name}</h1>



                                    {/* Категория */}
                                    <div className="post_category">
                                        <strong>Категория:</strong> {selectedPost.categorie}
                                    </div>

                                    {/* Текст поста */}
                                    <div className="post_content">
                                        <h3>Текст поста:</h3>
                                        <div className="admin_post_text">
                                            {selectedPost.text}
                                        </div>
                                    </div>

                                    {/* Галерея изображений */}
                                    {selectedPost.images && selectedPost.images.length > 0 && (
                                        <div className="post_gallery">
                                            <h3>Изображения ({selectedPost.images.length})</h3>
                                            <div className="gallery_container">
                                                {selectedPost.images.map((image, index) => (
                                                    <div key={index} className="gallery_item">
                                                        <img
                                                            src={image}
                                                            alt={`Изображение ${index + 1}`}
                                                            className="gallery_image"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Информация о посте */}
                                    <div className="post_info">
                                        <p><strong>Автор:</strong> {selectedPost.user}</p>
                                        <p><strong>Дата создания:</strong> {selectedPost.date}</p>
                                    </div>

                                    {/* Кнопки управления */}
                                    <div className="post_modal_buttons">
                                        <button
                                            className="post_modal_btn cancel_btn"
                                            onClick={closePostModal}
                                        >
                                            Закрыть
                                        </button>
                                        <div className="post_status_section">
                                            {/* <label className="post_status_label">Статус:</label> */}
                                            <select
                                                className="post_status_select"
                                                value={selectedPost.status || "pending"}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                            >
                                                <option value="pending">Ожидание</option>
                                                <option value="published">Опубликован</option>
                                                <option value="cancelled">Отменен</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}