import React from 'react'
import Naw from '../components/Naw'
import { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../css/Chat.css'
import { useAutoResizeTextarea } from '../components/UI/chat/textarea'
import { useNaw } from '../components/UI/chat/naw'
import { useChat } from '../hooks/useChat';

export default function Chat() {
    const { id } = useParams(); // Измените chatId на id
    const { textareaRef, adjustHeight, resetHeight } = useAutoResizeTextarea();
    const [inputText, setInputText] = useState('');
    const isMobile = useNaw();

    // Используем хук чата для работы с бэкендом
    const {
        currentChat,
        messages,
        loading,
        error,
        sendMessage,
        loadChatMessages
    } = useChat();

    const messagesEndRef = useRef(null);


    // Прокрутка к последнему сообщению
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Загрузка чата при изменении id
    useEffect(() => {
        if (id) {
            loadChatMessages(parseInt(id));
        }
    }, [id]); 

    // Прокрутка при изменении сообщений
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Обработчик отправки сообщения
    const handleSendMessage = async () => {
        if (inputText.trim() === '' || !id) return; 

        try {
            await sendMessage(parseInt(id), inputText); 
            setInputText('');
            resetHeight();
        } catch (err) {
            console.error('Ошибка отправки сообщения:', err);
            alert('Не удалось отправить сообщение');
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
        adjustHeight();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Получение URL аватара
    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return '../src/uploads/avatars/default-avatar.jpg';
        if (avatarPath.startsWith('http')) return avatarPath;
        return `http://localhost:5000${avatarPath}`;
    };

    // Форматирование времени
    const formatTime = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (error) {
            return '';
        }
    };

    if (loading && !messages.length) {
        return (
            <div className="Chat_body">
                {!isMobile && <Naw />}
                <div className="Chat">
                    <div className="loading">Загрузка чата...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="Chat_body">
                {!isMobile && <Naw />}
                <div className="Chat">
                    <div className="error">Ошибка: {error}</div>
                    <Link to="/messages" className="back-link">Вернуться к чатам</Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="Chat_body">
                {!isMobile && <Naw />}
                <div className="Chat">

                    {/* Заголовок чата с информацией о друге */}
                    <div className="Chat_header">
                        <div className="Chat_header_container">
                            <button className="Chat_header_btn">
                                <Link to={"/messages"}>
                                    <img src="../src/uploads/posts/strelka.svg" alt="Назад" className="Chat_header_btn_img" />
                                </Link>
                            </button>

                            {currentChat && currentChat.friend ? (
                                <>
                                    <div className="Chat_user_avatar">
                                        <Link to={`/user/${currentChat.friend.id}`}>
                                            <img 
                                                src={getAvatarUrl(currentChat.friend.avatar)} 
                                                alt={`${currentChat.friend.name} ${currentChat.friend.last_name}`}
                                                className="Chat_user_avatar_img" 
                                            />
                                        </Link>
                                    </div>

                                    <div className="Chat_header_info">
                                        <p className="Chat_user_name">
                                            {currentChat.friend.name} {currentChat.friend.last_name}
                                        </p>
                                        <Link to={`/user/${currentChat.friend.id}`} className="Chat_user_status">
                                            {currentChat.friend.login}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="Chat_header_info">
                                    <p className="Chat_user_name">Чат не найден</p>
                                    <p className="Chat_user_status">Попробуйте обновить страницу</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Область сообщений */}
                    <div className="Chat_chat">
                        <div className="Chat_messages">
                            {messages.length === 0 ? (
                                <div className="no-messages">
                                    <p>Начните общение первым!</p>
                                </div>
                            ) : (
                                messages.map(message => {
                                    const isMyMessage = message.sender?.is_me;
                                    
                                    return (
                                        <div 
                                            key={message.id} 
                                            className={`Chat_message ${isMyMessage ? 'my-message' : 'friend-message'}`}
                                        >
                                            {/* {!isMyMessage && (
                                                <div className="message-avatar">
                                                    <img 
                                                        src={getAvatarUrl(message.sender?.avatar)} 
                                                        alt={message.sender?.name} 
                                                        className="message-avatar-img"
                                                    />
                                                </div>
                                            )} */}
                                            <div className="message-content">
                                                <p className='Chat_message_text'>{message.text}</p>
                                                <span className='Chat_message_time'>
                                                    {formatTime(message.created_at)}
                                                    {message.is_read && isMyMessage && (
                                                        <span className="read-indicator"> ✓</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Поле ввода */}
                        <div className="Chat_chat_fon_inp">
                            <textarea
                                ref={textareaRef}
                                className="Chat_chat_input"
                                placeholder='Сообщение'
                                value={inputText}
                                onInput={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <button 
                                className="Chat_chat_btn" 
                                onClick={handleSendMessage}
                                disabled={loading || !inputText.trim()}
                            >
                                {loading ? (
                                    <div className="loading-spinner"></div>
                                ) : (
                                    <img src="../src/uploads/posts/strelka.svg" alt="Отправить" className="Chat_chat_btn_img" />
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}