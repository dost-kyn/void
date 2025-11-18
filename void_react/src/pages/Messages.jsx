import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import Naw from '../components/Naw'
import { useChat } from '../hooks/useChat';
import '../css/Messages.css'



export default function Messages() {
    const {
        chats,
        loading,
        error,
        loadChats
    } = useChat();

    // Загружаем чаты при монтировании компонента
    useEffect(() => {
        loadChats();
    }, []);

    // Получение URL аватара
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '../src/uploads/avatars/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `http://localhost:5000${avatarPath}`;
    };

    // Форматирование даты последнего сообщения
    const formatLastMessageDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (date.toDateString() === today.toDateString()) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else if (date.toDateString() === yesterday.toDateString()) {
                return 'Вчера';
            } else {
                return date.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'numeric',
                    year: '2-digit'
                });
            }
        } catch (error) {
            return '';
        }
    };

    // Обрезка длинного текста сообщения
    const truncateMessage = (text, maxLength = 50) => {
        if (!text) return 'Нет сообщений';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (loading) {
        return (
            <div className="body">
                <Naw />
                <div className="Messages">
                    <div className="messages_tools">
                        <h1 className='messages_title'>Чаты</h1>
                    </div>
                    <div className="loading">Загрузка чатов...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="body">
                <Naw />
                <div className="Messages">
                    <div className="messages_tools">
                        <h1 className='messages_title'>Чаты</h1>
                    </div>
                    <div className="error">Ошибка загрузки чатов: {error}</div>
                </div>
            </div>
        );
    }

    // Функция для правильного склонения слова "сообщение"
    function getMessageCountText(count) {
        if (count === 1) return 'новое сообщение';
        if (count >= 2 && count <= 4) return 'новых сообщения';
        return 'новых сообщений';
    }


    return (
        <>
            <div className="body">
                <Naw />
                <div className="Messages">
                    <div className="messages_tools">
                        <h1 className='messages_title'>Чаты ({chats.length})</h1>
                    </div>
                    <div className="messages_list_friends">
                        {chats.length === 0 ? (
                            <div className="no-chats">
                                <p>У вас пока нет чатов</p>
                                <p className="no-chats-hint">Начните общение с друзьями!</p>
                                <Link to="/friends" className="go-to-friends-btn">
                                    Перейти к друзьям
                                </Link>
                            </div>
                        ) : (
                            chats.map(chat => (
                                <Link
                                    key={chat.id}
                                    to={`/chat/${chat.id}`}
                                    className='message_link'
                                >
                                    <div className="message">
                                        <div className="message_one">
                                            <div className="message_avatar">
                                                <img
                                                    className="message_avatar_img"
                                                    src={getAvatarUrl(chat.friend?.avatar)}
                                                    alt={chat.friend?.name}
                                                />
                                                {chat.unread_count > 0 && (
                                                    <div className="unread-badge">
                                                        {chat.unread_count > 99 ? '99+' : chat.unread_count}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="message_data">
                                                <p className="message_name">
                                                    {chat.friend?.name || 'Неизвестный'} {chat.friend?.last_name || ''}
                                                </p>
                                                <p className='message_chat_lately'>
                                                    {chat.last_message ? (
                                                        <>
                                                            {chat.last_message.is_my_message && 'Вы: '}
                                                            {truncateMessage(chat.last_message.text)}
                                                        </>
                                                    ) : (
                                                        'Нет сообщений'
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="message_date_number">
                                            <p className='message_date'>
                                                {chat.last_message ?
                                                    formatLastMessageDate(chat.last_message.time) :
                                                    ''
                                                }
                                            </p>
                                            {chat.unread_count > 0 && (
                                                <p className='message_number'>
                                                    {chat.unread_count} {getMessageCountText(chat.unread_count)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

