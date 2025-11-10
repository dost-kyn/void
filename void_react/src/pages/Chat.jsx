import React from 'react'
import Naw from '../components/Naw'
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import '../css/Chat.css'

import { useAutoResizeTextarea } from '../components/UI/chat/textarea'

export default function Chat() {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage = {
            id: Date.now(),
            text: inputText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMy: true
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        resetHeight(); // используем функцию из хука
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
    return (
        <>
            <div className="Chat_body">

                <Naw />
                <div className="Chat">

                    <div className="Chat_header">
                        <div className="Chat_header_container">

                            <button className="Chat_header_btn">
                                <Link to={"/messages"}>
                                    <img src="../src/uploads/posts/strelka.svg" alt="" className="Chat_header_btn_img" />
                                </Link>
                            </button>

                            <div className="Chat_user_avatar">
                                <Link to={"/profile"}>
                                <img src="../src/uploads/profile/avatar.jpg" alt="" className="Chat_user_avatar_img" />
                                </Link>
                            </div>

                            <div className="Chat_header_info">
                                <p className="Chat_user_name">Имя друга</p>
                                <p className="Chat_user_status">Не в сети</p>
                            </div>

                        </div>
                    </div>

                    <div className="Chat_chat">
                        <div className="Chat_messages">
                            <div className="Chat_message friend-message">
                                <p className='Chat_message_text'>Че кто?</p>
                                <span className='Chat_message_time'>20:45</span>
                            </div>
                            <div className="Chat_message my-message">
                                <p className='Chat_message_text'>Чел ты не одолел.</p>
                                <span className='Chat_message_time'>20:45</span>
                            </div>
                            {messages.map(message => (
                                <div key={message.id} className={`Chat_message ${message.isMy ? 'my-message' : 'friend-message'}`}>
                                    <p className='Chat_message_text'>{message.text}</p>
                                    <span className='Chat_message_time'>{message.time}</span>
                                </div>
                            ))}
                        </div>

                        <div className="Chat_chat_fon_inp">
                            <textarea
                                ref={textareaRef}
                                className="Chat_chat_input"
                                placeholder='Сообщение'
                                value={inputText}
                                onInput={handleInputChange}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="Chat_chat_btn" onClick={handleSendMessage}>
                                <img src="../src/uploads/posts/strelka.svg" alt="" className="Chat_chat_btn_img" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
