import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import '../css/Friends.css'
import Naw from '../components/Naw'
import { useFriends } from '../hooks/useFriends'

export default function Friends() {
    const {
        friends,
        friendRequests,
        sentRequests,
        loading,
        error,
        acceptFriendRequest,
        rejectFriendRequest
    } = useFriends();

    const [searchTerm, setSearchTerm] = useState('');

    // Фильтрация
    const filteredFriends = friends.filter(friend => 
        friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.login.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRequests = friendRequests.filter(request =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.login.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSentRequests = sentRequests.filter(request =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.login.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Форматирование даты
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (loading) {
        return (
            <div className="body">
                <Naw />
                <div className="loading">Загрузка друзей...</div>
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
                                src={request.avatar || '../src/uploads/avatars/default-avatar.jpg'} 
                                alt={`${request.name} ${request.last_name}`} 
                            />
                        </div>
                        <Link to={`/profile/${request.id}`} className='friend_link'>
                            <div className="request_data">
                                <p className="request_name">{request.name} {request.last_name}</p>
                                <p className='request_online_lately'>@{request.login}</p>
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
                                src={request.avatar || '../src/uploads/avatars/default-avatar.jpg'} 
                                alt={`${request.name} ${request.last_name}`} 
                            />
                        </div>
                        <Link to={`/profile/${request.id}`} className='friend_link'>
                            <div className="request_data">
                                <p className="request_name">{request.name} {request.last_name}</p>
                                <p className='request_online_lately'>@{request.login}</p>
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
                        src={friend.avatar || '../src/uploads/avatars/default-avatar.jpg'} 
                        alt={`${friend.name} ${friend.last_name}`} 
                    />
                </div>
                <Link to={`/profile/${friend.id}`} className='friend_link'>
                    <div className="friend_data">
                        <p className="friend_name">{friend.name} {friend.last_name}</p>
                        <p className='friend_chat_lately'>@{friend.login}</p>
                    </div>
                </Link>
            </div>
            <div className="friend_buttons">
                <button className='friend_but_chat'>Написать</button>
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