import React from 'react'
import Naw from '../components/Naw'

import '../css/Posts.css'

import { useImage } from '../components/UI/posts/post_image'

export default function Posts() {
    const { OpenModal, CloseModal, selectedImage } = useImage(null)

    return (
        <>
            <div className="body">
                <Naw />

                <div className="Posts">
                    <h1 className="Posts_title">Посты</h1>

                    <div className="Posts_tools">
                        <div className="Posts_tools_filter">
                            <button className="Posts_tools_filter_button">
                                <img src="../src/uploads/filter.svg" alt="" className="Posts_tools_filter_img" />
                                <h2 className="Posts_tools_filter_title">Фильтр</h2>
                            </button>
                        </div>

                        <div className="Posts_tools_find">
                            <input type="text" placeholder='Поиск по названию' className='Posts_tools_find_inp' />
                        </div>
                    </div>


                    <div className="Posts_posts">


                        <div className="Posts_posts_post">
                            <div className="post_slider">
                                <button className='post_slider_prev'>
                                    <img src="../src/uploads/posts/strelka.svg" alt="" className="post_slider_btn_img post_slider_btn_img_prev" />
                                </button>
                                <div className="post_image">
                                    <img src="../src/uploads/posts/post_1.jpg" alt=""
                                        className="post_image_img"
                                        onClick={() => OpenModal("../src/uploads/posts/post_1.jpg")}
                                    />
                                </div>
                                <button className='post_slider_next'>
                                    <img src="../src/uploads/posts/strelka.svg" alt="" className="post_slider_btn_img" />
                                </button>
                            </div>

                            <div className="post_contant">
                                <h3 className="post_title">Новый друг</h3>
                                <p className="post_text">
                                    Хей, всем привет!
                                    <br /><br />
                                    Сегодня ходила в магазин за продуктами и увидела там это чудо. She's so sweet!
                                    Я просто не могла пройти мимо нее.
                                    <br /><br />
                                    Я уже час думаю над тем, как назвать ее и не могу решить... Может у кого-то
                                    из вас будут предположения?
                                    <br /><br />
                                    В любом случае желаю хорошего дня всем, бээ 🐑🌿
                                </p>
                                <div className="post_info">
                                    <p className="post_author">Kron_prince</p>
                                    <p className="post_date">20.11.25</p>
                                </div>
                            </div>

                        </div>

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
            </div>


        </>
    )
}
