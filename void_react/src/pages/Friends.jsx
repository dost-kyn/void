import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import '../css/Friends.css'
import Naw from '../components/Naw'
import { useStartChatWithFriend } from '../hooks/useChat';
import { 
    useFriends, 
    filterFriends, 
    filterFriendRequests, 
    filterSentRequests, 
    formatDate, 
    getAvatarUrl 
} from '../hooks/useFriends'

export default function Friends() {
    const { friends, friendRequests,  sentRequests, error, acceptFriendRequest, rejectFriendRequest } = useFriends();
    const { startChat, error: chatError } = useStartChatWithFriend();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '../src/uploads/avatars/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `http://localhost:5000${avatarPath}`;
    };

    // Обработчик начала чата с другом
    const handleStartChat = async (friendId) => {
        try {
            const chat = await startChat(friendId);
            navigate(`/chat/${chat.id}`);
        } catch (err) {
            console.error('Error starting chat:', err);
            alert('Ошибка при создании чата: ' + err.message);
        }
    };

    // Фильтрация
    const filteredFriends = filterFriends(friends, searchTerm);
    const filteredRequests = filterFriendRequests(friendRequests, searchTerm);
    const filteredSentRequests = filterSentRequests(sentRequests, searchTerm);


    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return 'Дата не указана';
        try {
            return new Date(dateString).toLocaleDateString('ru-RU');
        } catch (error) {
            return 'Неверная дата';
        }
    };

    if (error) {
        return (
            <div className="body">
                <Naw />
                <div className="error">Ошибка: {error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="body">
                <Naw />
                <div className="Friends">
                    <div className="friends_tools">
                        <h1 className='friends_title'>Друзья</h1>
                        <div className="friends_tools_find">
                            <input
                                type="text"
                                placeholder='Поиск по имени и логину'
                                className='friends_tools_find_inp'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="list_friends">


                        {/* Входящие заявки */}
                        {filteredRequests.length > 0 && (
                            <div className="friend_requests">
                                <h2 className='friend_request_title'>Заявки в друзья ({filteredRequests.length})</h2>
                                <div className="list_requests">
                                    {filteredRequests.map(request => (
                                        <div key={request.friendship_id} className="request">
                                            <div className="request_one">
                                                <div className="request_avatar">
                                                    <img
                                                        className="request_avatar_img"
                                                        src={getAvatarUrl(request.avatar)}
                                                        alt={`${request.name} ${request.last_name}`}
                                                    />
                                                </div>
                                                <Link to={`/user/${request.id}`} className='friend_link'>
                                                    <div className="request_data">
                                                        <p className="request_name">{request.name} {request.last_name}</p>
                                                        <p className='request_online_lately'>{request.login}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="request_buttons">
                                                <button
                                                    className='request_but true'
                                                    onClick={() => acceptFriendRequest(request.friendship_id)}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    className='request_but false'
                                                    onClick={() => rejectFriendRequest(request.friendship_id)}
                                                >
                                                    ✘
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Отправленные заявки */}
                        {filteredSentRequests.length > 0 && (
                            <div className="friend_requests">
                                <h2 className='friend_request_title'>Отправленные заявки ({filteredSentRequests.length})</h2>
                                <div className="list_requests">
                                    {filteredSentRequests.map(request => (
                                        <div key={request.friendship_id} className="request">
                                            <div className="request_one">
                                                <div className="request_avatar">
                                                    <img
                                                        className="request_avatar_img"
                                                        src={getAvatarUrl(request.avatar)}
                                                        alt={`${request.name} ${request.last_name}`}
                                                    />
                                                </div>
                                                <Link to={`/user/${request.id}`} className='friend_link'>
                                                    <div className="request_data">
                                                        <p className="request_name">{request.name} {request.last_name}</p>
                                                        <p className='request_online_lately'>{request.login}</p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className="request_buttons">
                                                <span className="request_status">Статус: Ожидание</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Список друзей */}
                        <h2 className='friend_title'>Мои друзья ({filteredFriends.length})</h2>
                        {filteredFriends.length === 0 ? (
                            <div className="no-friends">
                                <p>У вас пока нет друзей</p>
                            </div>
                        ) : (
                            filteredFriends.map(friend => (
                                <div key={friend.friendship_id} className="friend">
                                    <div className="friend_one">
                                        <div className="friend_avatar">
                                            <img
                                                className="friend_avatar_img"
                                                src={getAvatarUrl(friend.avatar)}
                                                alt={`${friend.name} ${friend.last_name}`}
                                            />
                                        </div>
                                        <Link to={`/user/${friend.id}`} className='friend_link'>
                                            <div className="friend_data">
                                                <p className="friend_name">{friend.name} {friend.last_name}</p>
                                                <p className='friend_chat_lately'>{friend.login}</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="friend_buttons">
                                        <button
                                            className='friend_but_chat'
                                            onClick={() => handleStartChat(friend.id)}
                                        >
                                            {'Написать'}
                                        </button>

                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}