import React from 'react'
import { Link } from 'react-router-dom';

import '../css/Friends.css'
import Naw from '../components/Naw'

export default function Friends() {
    return (
        <>
            <div className="body">
                <Naw />
                <div className="Friends">
                    <div className="friends_tools">
                        <h1 className='friends_title'>Друзья</h1>
                        <div className="friends_tools_find">
                            <input type="text" placeholder='Поиск по имени и логину' className='friends_tools_find_inp' />
                        </div>
                    </div>
                    <div className="list_friends">
                        <div className="friend_requests">
                            <h2 className='friend_request_title'>Заявки в друзья</h2>
                            <div className="list_requests">
                                <div className="request">
                                    <div className="request_one">
                                        <div className="request_avatar">
                                            <img className="request_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                        </div>
                                        <Link to="/profile" className='friend_link'>
                                            <div className="request_data">
                                                <p className="request_name">Имя пользователя</p>
                                                <p className='request_online_lately'>Был в сети 23:12</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="request_buttons">
                                        <button className='request_but true'>✓</button>
                                        <button className='request_but false'>✘</button>
                                    </div>
                                </div>
                                <div className="request">
                                    <div className="request_one">
                                        <div className="request_avatar">
                                            <img className="request_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                        </div>
                                        <Link to="/profile" className='friend_link'>
                                            <div className="request_data">
                                                <p className="request_name">Имя пользователя</p>
                                                <p className='request_online_lately'>Был в сети 23:12</p>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="request_buttons">
                                    <button className='request_but true'>✓</button>
                                    <button className='request_but false'>✘</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h2 className='friend_title'>Мои друзья</h2>
                        <div className="friend">
                            <div className="friend_one">
                                <div className="friend_avatar">
                                    <img className="friend_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                </div>
                                <Link to="/profile" className='friend_link'>
                                    <div className="friend_data">
                                        <p className="friend_name">Имя друга</p>
                                        <p className='friend_chat_lately'>Последнее сообщение в чате</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="friend_buttons">
                                <button className='friend_but_chat'>Написать</button>
                            </div>
                        </div>
                        <div className="friend">
                            <div className="friend_one">
                                <div className="friend_avatar">
                                    <img className="friend_avatar_img" src="../src/uploads/avatars/ava.jpg" alt="" />
                                </div>
                                <Link to="/profile" className='friend_link'>
                                    <div className="friend_data">
                                        <p className="friend_name">Имя друга</p>
                                        <p className='friend_chat_lately'>Последнее сообщение в чате</p>
                                    </div>
                                </Link>
                            </div>
                            <div className="friend_buttons">
                                <button className='friend_but_chat'>Написать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}