import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Naw from '../components/Naw';
import Alert from '../components/Alert';
import { useAlert } from '../components/UI/alert';
import {
    useUserProfile,
    getAvatarUrl,
    getImageUrl,
    BecomeFriend,
    formatDate,
    isMyProfile,
    handleSendMessage
} from '../components/UI/profile/useUserProfile';
import { useImage } from '../components/UI/posts/post_image';
import { useReadMore } from '../components/UI/posts/read_more';
import { useState } from 'react';
import '../css/Profile.css';

export default function UserProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Используем хук для оповещений
    const { alert, showActionAlert, closeAlert } = useAlert();

    const {
        user,
        userPosts,
        loading,
        error,
        isFriend,
        hasSentRequest,
        refetch,
        updateRequestStatus
    } = useUserProfile(id);

    // Хуки для функционала постов
    const { OpenModal, CloseModal, selectedImage } = useImage(null);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});

    // Обработчик отправки заявки в друзья
    const handleBecomeFriend = async () => {
        try {
            await BecomeFriend(user.id, updateRequestStatus);
            showActionAlert('friend_request_sent', 'success');
        } catch (error) {
            console.error('Ошибка:', error);
            if (error.message === 'Заявка уже существует') {
                updateRequestStatus(true);
                showActionAlert('friend_request_exists', 'info');
            } else {
                showActionAlert('friend_request_error', 'error');
            }
        }
    };

    // Обработчик перехода в чат
    const handleSendMessageClick = async () => {
        try {
            const chat = await handleSendMessage(user.id, isFriend, showActionAlert);
            if (chat) {
                navigate(`/chat/${chat.id}`);
            }
        } catch (error) {
            console.error('Ошибка при переходе в чат:', error);
        }
    };

    // Функции для слайдера изображений
    const handleNextImage = (postId) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const post = userPosts.find(p => p.id === postId);
            const imagesCount = post?.images?.length || 0;
            return {
                ...prev,
                [postId]: imagesCount > 0 ? (currentIndex + 1) % imagesCount : 0
            };
        });
    };

    const handlePrevImage = (postId) => {
        setCurrentImageIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const post = userPosts.find(p => p.id === postId);
            const imagesCount = post?.images?.length || 0;
            return {
                ...prev,
                [postId]: imagesCount > 0 ? (currentIndex - 1 + imagesCount) % imagesCount : 0
            };
        });
    };

    const handleSetImageIndex = (postId, index) => {
        setCurrentImageIndexes(prev => ({
            ...prev,
            [postId]: index
        }));
    };

    // Функция для переключения "Читать далее"
    const handleToggleExpand = (postId) => {
        setExpandedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // Функция проверки возможности чата
    const checkIfCanChat = async (targetUserId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/can-chat/${targetUserId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка проверки чата');
            }

            const result = await response.json();
            return result.canChat;

        } catch (error) {
            console.error('Ошибка проверки чата:', error);
            return false;
        }
    };

    // Проверяем, это мой профиль или нет
    const myProfile = isMyProfile(id);

    if (loading) {
        return (
            <div className="body">
                <Naw />
                <div className="loading">Загрузка профиля...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="body">
                <Naw />
                <div className="error">{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="body">
                <Naw />
                <div className="error">Пользователь не найден</div>
            </div>
        );
    }

    return (
        <div className="body">
            <Naw />
            <Alert
                isOpen={alert.isOpen}
                text={alert.text}
                type={alert.type}
                onClose={closeAlert}
            />

            <div className="Profile">
                <h1 className="Posts_title">
                    {user.name} {user.last_name}
                    {myProfile && <span style={{ fontSize: '16px', color: '#666', marginLeft: '10px' }}>(Ваш профиль)</span>}
                </h1>

                <div className="Profile_user">
                    <div className="Profile_user_column">
                        <div className="Profile_user_avatar">
                            <img
                                src={getAvatarUrl(user.avatar)}
                                alt={`${user.name} ${user.last_name}`}
                                className="Profile_user_avatar_img"
                            />
                        </div>
                        <div className="profile_info">
                            <p className="ProfileUser_avatar_info_p profile_login">{user.login}</p>
                            <p className="ProfileUser_avatar_info_p profile_joined">
                                Зарегистрирован: {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>

                    {!myProfile && (
                        <div className="Profile_user_column">
                            {isFriend ? (
                                // Если друг - кнопка "Написать"
                                <button
                                    className="ProfileUser_column_button_btn"
                                    onClick={handleSendMessageClick}
                                >
                                    Написать
                                </button>
                            ) : hasSentRequest ? (
                                // Если отправили заявку - кнопка "Ожидание ответа"
                                <button
                                    className="ProfileUser_column_button_btn"
                                    disabled
                                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                                >
                                    Ожидание ответа
                                </button>
                            ) : (
                                // Если не друг и не отправили заявку - кнопка "Отправить заявку"
                                <button
                                    className="ProfileUser_column_button_btn"
                                    onClick={handleBecomeFriend}
                                >
                                    Отправить заявку в друзья
                                </button>
                            )}
                        </div>
                    )}
                </div>


                <div className="Profile_tools">
                    <h2 className="Profile_tools_title">Посты пользователя ({userPosts.length})</h2>
                </div>
                {/* Посты пользователя */}
                <div className="Posts_posts">

                    {userPosts && userPosts.length > 0 ? (
                        userPosts.map(post => {
                            const postImages = post.images && post.images.length > 0
                                ? post.images.map(img => {
                                    const fullUrl = getImageUrl(img.image_url);
                                    return fullUrl;
                                })
                                : [];

                            const currentIndex = currentImageIndexes[post.id] || 0;
                            const showSliderButtons = postImages.length > 1;
                            const isExpanded = expandedPosts[post.id] || false;
                            const hasImages = postImages.length > 0;

                            // Проверка на переполнение текста (простая версия)
                            const isOverflowed = post.text && post.text.length > 200;

                            return (
                                <div key={post.id} className="Posts_posts_post">

                                    {hasImages && (
                                        <div className="post_slider">
                                            {/* Кнопки слайдера */}
                                            {showSliderButtons && (
                                                <div className="post_slider_buttons">
                                                    <button className='post_slider_prev' onClick={() => handlePrevImage(post.id)}>
                                                        <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                                    </button>
                                                    <button className='post_slider_next' onClick={() => handleNextImage(post.id)}>
                                                        <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Изображение */}
                                            <div className="post_image">
                                                <img
                                                    src={postImages[currentIndex]}
                                                    alt={`Изображение поста ${post.title}`}
                                                    className="post_image_img"
                                                    onClick={() => {
                                                        OpenModal(postImages[currentIndex]);
                                                    }}
                                                />
                                            </div>

                                            {/* Индикаторы слайдера */}
                                            {showSliderButtons && (
                                                <div className="slider_indicators">
                                                    {postImages.map((_, index) => (
                                                        <span
                                                            key={index}
                                                            className={`slider_indicator ${index === currentIndex ? 'active' : ''}`}
                                                            onClick={() => handleSetImageIndex(post.id, index)}
                                                        ></span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="post_contant">
                                        <h3 className="post_title">{post.title}</h3>
                                        <div className={`post_text ${isExpanded ? 'expanded' : ''}`}>
                                            <p>{post.text}</p>
                                        </div>
                                        {isOverflowed && (
                                            <div className="read_more_button">
                                                <button className="read_more_btn" onClick={() => handleToggleExpand(post.id)}>
                                                    {isExpanded ? 'Скрыть' : 'Читать далее'}
                                                </button>
                                            </div>
                                        )}
                                        <div className="post_info">
                                            <p className="post_author">{post.user_post_ship?.login || user?.login}</p>

                                            <p className="post_date">
                                                {post.created_at ? new Date(post.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-posts">
                            <p>У пользователя пока нет постов</p>
                        </div>
                    )}
                </div>

                {/* Модальное окно для увеличенного изображения поста */}
                {selectedImage && (
                    <div className="modal_overlay" onClick={CloseModal}>
                        <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                            <button className="modal_close" onClick={CloseModal}>×</button>
                            <img src={selectedImage} alt="Увеличенное изображение" className="modal_image" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}