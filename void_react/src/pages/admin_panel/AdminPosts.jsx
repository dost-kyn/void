import React from 'react'
import '../../css/Admin_panel.css'
import { useState, useEffect } from 'react'; // Добавил useEffect
import Naw_Admin_panel from '../../components/Naw_Admin_panel'

const API_URL = 'http://localhost:5000/api';

export default function AdminPosts() {
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция загрузки постов из БД
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/posts/all`); // Создадим этот роут на сервере

            if (!response.ok) {
                throw new Error(`Ошибка загрузки постов: ${response.status}`);
            }

            const postsData = await response.json();
            setPosts(postsData);
        } catch (err) {
            console.error('Ошибка при загрузке постов:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Загружаем посты при монтировании компонента
    useEffect(() => {
        fetchPosts();
    }, []);

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

    // Функция изменения статуса поста (для модального окна)
    const handleStatusChange = async (newStatus) => {
        if (selectedPost) {
            try {
                // Маппинг значений для фронтенда
                const statusMap = {
                    'pending': 'Expectation',
                    'published': 'Published',
                    'rejected': 'Rejected'
                };

                const normalizedStatus = statusMap[newStatus] || newStatus;
                console.log(`Изменен статус поста ${selectedPost.id} на: ${normalizedStatus}`);

                const response = await fetch(`${API_URL}/posts/${selectedPost.id}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: normalizedStatus })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при обновлении статуса');
                }

                // Обновляем локальное состояние
                setSelectedPost({
                    ...selectedPost,
                    status: normalizedStatus
                });

                setPosts(posts.map(post =>
                    post.id === selectedPost.id
                        ? { ...post, status: normalizedStatus }
                        : post
                ));

                console.log('Статус успешно обновлен на сервере');

            } catch (error) {
                console.error('Ошибка при обновлении статуса:', error);
                alert('Ошибка при обновлении статуса');
            }
        }
    };

    // Функция для изменения статуса из таблицы
    const handleTableStatusChange = async (postId, newStatus) => {
        try {
            // Маппинг значений для фронтенда
            const statusMap = {
                'pending': 'Expectation',
                'published': 'Published',
                'rejected': 'Rejected'
            };

            const normalizedStatus = statusMap[newStatus] || newStatus;
            console.log(`🔄 Изменяем статус поста ${postId} на: ${normalizedStatus}`);

            const response = await fetch(`${API_URL}/posts/${postId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: normalizedStatus })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Ошибка сервера:', response.status, errorData);
                throw new Error(`Ошибка ${response.status}: ${errorData.error || 'Неизвестная ошибка сервера'}`);
            }

            const updatedPost = await response.json();
            console.log('✅ Статус успешно обновлен:', updatedPost);

            // Обновляем локальное состояние
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, status: normalizedStatus }
                    : post
            ));

        } catch (error) {
            console.error('❌ Ошибка при обновлении статуса:', error);
            alert(`Ошибка при обновлении статуса: ${error.message}`);
        }
    };


    // Функция для форматирования даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    // Функция для получения текста статуса на русском
    const getStatusText = (status) => {
        const statusMap = {
            'Expectation': 'Ожидание',
            'Published': 'Опубликован',
            'Rejected': 'Отклонен'
        };
        return statusMap[status] || status;
    };

    return (
        <>
            <div className="body">
                <Naw_Admin_panel />

                <div className="AdminPosts">
                    <h1 className="adminPosts_title">Посты</h1>

                    {/* Состояние загрузки */}
                    {loading && (
                        <div className="loading_message">
                            <p>Загрузка постов...</p>
                        </div>
                    )}

                    {/* Состояние ошибки */}
                    {error && (
                        <div className="error_message">
                            <p>Ошибка: {error}</p>
                            <button onClick={fetchPosts} className="retry_btn">
                                Попробовать снова
                            </button>
                        </div>
                    )}

                    <div className="adminPosts_content">
                        {!loading && !error && (
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
                                            <td>{post.title}</td>
                                            <td>{post.text ? post.text.substring(0, 50) + '...' : 'Нет текста'}</td>
                                            <td>{post.images ? post.images.length : 0} фото</td>
                                            <td>{post.user_post_ship?.login || 'Неизвестно'}</td>
                                            <td>{post.post_category_ship?.name || 'Без категории'}</td>
                                            <td>{formatDate(post.created_at)}</td>
                                            <td>
                                                <select
                                                    className={`status_select ${post.status}`}
                                                    value={post.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handleTableStatusChange(post.id, e.target.value);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <option value="Expectation">Ожидание</option>
                                                    <option value="Published">Опубликован</option>
                                                    <option value="Rejected">Отклонен</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {/* Сообщение если нет постов */}
                        {!loading && !error && posts.length === 0 && (
                            <div className="no_posts_message">
                                <p>Нет постов для модерации</p>
                            </div>
                        )}
                    </div>

                    {isModalOpen && selectedPost && (
                        <>
                            <div className="modal_overlay" onClick={closePostModal}>
                                <div className="post_view_modal" onClick={(e) => e.stopPropagation()}>
                                    <h1 className="post_view_title">{selectedPost.title}</h1>

                                    {/* Категория */}
                                    <div className="post_category">
                                        <strong>Категория:</strong> {selectedPost.post_category_ship?.name || 'Без категории'}
                                    </div>

                                    {/* Текст поста */}
                                    <div className="post_content">
                                        <h3>Текст поста:</h3>
                                        <div className="admin_post_text">
                                            {selectedPost.text || 'Текст отсутствует'}
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
                                                            src={`http://localhost:5000${image.image_url}`}
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
                                        <p><strong>Автор:</strong> {selectedPost.user_post_ship?.login || 'Неизвестно'}</p>
                                        <p><strong>Дата создания:</strong> {formatDate(selectedPost.created_at)}</p>
                                        <p><strong>Текущий статус:</strong> {getStatusText(selectedPost.status)}</p>
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
                                            <select
                                                className="post_status_select"
                                                value={selectedPost.status || "pending"}
                                                onChange={(e) => handleStatusChange(e.target.value)}
                                            >
                                                <option value="Expectation">Ожидание</option>
                                                <option value="Published">Опубликован</option>
                                                <option value="Rejected">Отклонен</option>
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