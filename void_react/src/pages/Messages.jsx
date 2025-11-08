import React from 'react'
import { Link } from 'react-router-dom';

import '../css/Messages.css'
import Naw from '../components/Naw'

export default function Messages() {
    return (
        <>
            <div className="body">
                <Naw />
                <div className="Messages">
                    <div className="messages_tools">
                        <h1 className='messages_title'>Чаты</h1>
                    </div>
                    <div className="messages_list_friends">
                        <Link to="/chat" className='message_link'>
                            <div className="message">
                                <div className="message_one">
                                    <div className="message_avatar">
                                        <img className="message_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                    </div>
                                    <div className="message_data">
                                        <p className="message_name">Имя друга</p>
                                        <p className='message_chat_lately'>Последнее сообщение в чате</p>
                                    </div>
                                </div>
                                <div className="message_date_number">
                                    <p className='message_date'>12.10.25</p>
                                    <p className='message_number'>34 новых сообщений</p>
                                </div>
                            </div>
                        </Link>
                        <Link to="/chat" className='message_link'>
                            <div className="message">
                                <div className="message_one">
                                    <div className="message_avatar">
                                        <img className="message_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                    </div>
                                    <div className="message_data">
                                        <p className="message_name">Имя друга</p>
                                        <p className='message_chat_lately'>Последнее сообщение в чате</p>
                                    </div>
                                </div>
                                <div className="message_date_number">
                                    <p className='message_date'>12.10.25</p>
                                    <p className='message_number'>34 новых сообщений</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div >
        </>
    )
}