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
            
            {/* Alert компонент */}
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

                    {/* Кнопки действий - показываем только если это не наш профиль */}
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

                {/* Посты пользователя */}
                <div className="profile_posts">
                    <h2>Посты пользователя ({userPosts.length})</h2>
                    {userPosts.length === 0 ? (
                        <p>У пользователя пока нет постов</p>
                    ) : (
                        userPosts.map(post => (
                            <div key={post.id} className="post">
                                <h3>{post.title}</h3>
                                <p>{post.text}</p>
                                {post.images && post.images.length > 0 && (
                                    <div className="post-images">
                                        {post.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={getImageUrl(image.image_url)}
                                                alt={`Изображение ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                                <p className="post-date">
                                    {formatDate(post.created_at)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}