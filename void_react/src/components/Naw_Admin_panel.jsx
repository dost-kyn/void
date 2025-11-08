import React from 'react'

import '../css/Style.css'
import { Link, useLocation } from 'react-router-dom'
import { useExit } from '../components/UI/exit'//

export default function Naw_Admin_panel() {
    const { OpenExit, CloseExit, exit } = useExit(false) //

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            <div className="naw">
                <div className="naw_container">
                    <div className="logo">
                        <img src="../src/uploads/logo.svg" alt="" className="logo_img" />
                    </div>
                    <div className="naw_links">
                        <Link to={'/adminUsers'} className='naw_link'>
                            <img
                                src={currentPath === '/adminUsers' ? "../src/uploads/friends_active.svg" : "../src/uploads/friends.svg"}
                                alt="Пользователи"
                                className="naw_link_img"
                            />
                        </Link>
                        <Link to={'/adminPosts'} className='naw_link'>
                            <img
                                src={currentPath === '/adminPosts' ? "../src/uploads/posts_active.svg" : "../src/uploads/posts.svg"}
                                alt="Посты"
                                className="naw_link_img"
                            />
                        </Link>
                        <Link to={'/adminCategories'} className='naw_link'>
                            <img
                                src={currentPath === '/adminCategories' ? "../src/uploads/categories_active.svg" : "../src/uploads/categories.svg"}
                                alt="Категории"
                                className="naw_link_img"
                            />
                        </Link>


                        <button className="exit" onClick={OpenExit}>
                            <img
                                src="../src/uploads/exit.svg"
                                alt="Профиль"
                                className="naw_link_img"
                            />

                        </button>


                    </div>

                </div>
            </div>


            
            {exit && (
                <>
                <div className="modal_overlay" onClick={CloseExit}></div>
                <div className="naw_modal_exit">
                    <div className="naw_modal_exit_contant">
                        <h3 className="naw_modal_exit_contant_title">Вы действительно хотите выйти?</h3>
                        <div className="naw_modal_exit_contant_buttons">
                            <button className="naw_modal_exit_contant_btn" onClick={CloseExit}>нет</button>
                            <button className="naw_modal_exit_contant_btn">да</button>
                        </div>
                    </div>
                </div>
                </>
            )}
        </>
    )
}
