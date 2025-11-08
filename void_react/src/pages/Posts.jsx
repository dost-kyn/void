import React from 'react'
import Naw from '../components/Naw'

import '../css/Posts.css'

import { useState } from 'react'
import { useImage } from '../components/UI/posts/post_image'
import { useFilter } from '../components/UI/posts/filter'
import { useSlider } from '../components/UI/posts/slider'

export default function Posts() {
    const { OpenModal, CloseModal, selectedImage } = useImage(null)
    const { sostFilter, OpenFilter, CloseFilter } = useFilter(false)

    // Массив изображений для поста
    const postImages = [
        "../src/uploads/posts/post_1.jpg",
        "../src/uploads/posts/post_2.jpg",
        "../src/uploads/posts/post_3.jpg",
    ];

    // Передаем postImages в хук
    const { currentImageIndex, nextImage, prevImage, showSliderButtons } = useSlider(postImages);

    return (
        <>
            <div className="body">
                <Naw />

                <div className="Posts">
                    <h1 className="Posts_title">Посты</h1>

                    <div className="Posts_tools">


                        <div className="Posts_tools_filter">
                            <button className="Posts_tools_filter_button" onClick={OpenFilter}>
                                <img src="../src/uploads/filter.svg" alt="" className="Posts_tools_filter_img" />
                                <h2 className="Posts_tools_filter_title">Фильтр</h2>
                            </button>


                            {/* Фильтр */}
                            {sostFilter && (
                                <div className="filter_modal">
                                    <div className="filter_modal_close_container">
                                        <button className='filter_modal_close' onClick={CloseFilter}>✘</button>
                                    </div>


                                    <div className="filter_modal_punkts">
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>
                                        <div className="filter_modal_punkt">
                                            <input type="checkbox" className="filter_modal_punkt_inp" />
                                            <p className="filter_modal_punkt_p">Животные</p>
                                        </div>

                                    </div>




                                </div>
                            )}
                        </div>


                        <div className="Posts_tools_find">
                            <input type="text" placeholder='Поиск по названию' className='Posts_tools_find_inp' />
                        </div>
                    </div>



                    <div className="Posts_posts">
                        <div className="Posts_posts_post">
                            <div className="post_slider">
                                {/* Кнопки слайдера показываем только если нужно */}
                                {showSliderButtons && (
                                    <div className="post_slider_buttons">
                                        <button className='post_slider_prev' onClick={prevImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                        </button>
                                        <button className='post_slider_next' onClick={nextImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                        </button>
                                    </div>
                                )}

                                <div className="post_image">
                                    <img
                                        src={postImages[currentImageIndex]}
                                        alt={`Изображение ${currentImageIndex + 1}`}
                                        className="post_image_img"
                                        onClick={() => OpenModal(postImages[currentImageIndex])}
                                    />
                                </div>

                                {/* Индикатор текущего слайда (точки) */}
                                {showSliderButtons && (
                                    <div className="slider_indicators">
                                        {postImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`slider_indicator ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            ></span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="post_contant">
                                <h3 className="post_title">Новый друг</h3>
                                <p className="post_text">
                                    Хей, всем привет!
                                    <br /><br />
                                    Сегодня ходила в магазин за продуктами и увидела там это чудо. She's so sweet!
                                    Я просто не могла пройти мимо нее.

                                </p>
                                <div className="post_info">
                                    <p className="post_author">Kron_prince</p>
                                    <p className="post_date">20.11.25</p>
                                </div>
                            </div>
                        </div>
                        <div className="Posts_posts_post">
                            <div className="post_slider">
                                {/* Кнопки слайдера показываем только если нужно */}
                                {showSliderButtons && (
                                    <div className="post_slider_buttons">
                                        <button className='post_slider_prev' onClick={prevImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                        </button>
                                        <button className='post_slider_next' onClick={nextImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                        </button>
                                    </div>
                                )}

                                <div className="post_image">
                                    <img
                                        src={postImages[currentImageIndex]}
                                        alt={`Изображение ${currentImageIndex + 1}`}
                                        className="post_image_img"
                                        onClick={() => OpenModal(postImages[currentImageIndex])}
                                    />
                                </div>

                                {/* Индикатор текущего слайда (точки) */}
                                {showSliderButtons && (
                                    <div className="slider_indicators">
                                        {postImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`slider_indicator ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            ></span>
                                        ))}
                                    </div>
                                )}
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
                        <div className="Posts_posts_post">
                            <div className="post_slider">
                                {/* Кнопки слайдера показываем только если нужно */}
                                {showSliderButtons && (
                                    <div className="post_slider_buttons">
                                        <button className='post_slider_prev' onClick={prevImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                        </button>
                                        <button className='post_slider_next' onClick={nextImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                        </button>
                                    </div>
                                )}

                                <div className="post_image">
                                    <img
                                        src={postImages[currentImageIndex]}
                                        alt={`Изображение ${currentImageIndex + 1}`}
                                        className="post_image_img"
                                        onClick={() => OpenModal(postImages[currentImageIndex])}
                                    />
                                </div>

                                {/* Индикатор текущего слайда (точки) */}
                                {showSliderButtons && (
                                    <div className="slider_indicators">
                                        {postImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`slider_indicator ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            ></span>
                                        ))}
                                    </div>
                                )}
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
                        <div className="Posts_posts_post">
                            <div className="post_slider">
                                {/* Кнопки слайдера показываем только если нужно */}
                                {showSliderButtons && (
                                    <div className="post_slider_buttons">
                                        <button className='post_slider_prev' onClick={prevImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                        </button>
                                        <button className='post_slider_next' onClick={nextImage}>
                                            <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                        </button>
                                    </div>
                                )}

                                <div className="post_image">
                                    <img
                                        src={postImages[currentImageIndex]}
                                        alt={`Изображение ${currentImageIndex + 1}`}
                                        className="post_image_img"
                                        onClick={() => OpenModal(postImages[currentImageIndex])}
                                    />
                                </div>

                                {/* Индикатор текущего слайда (точки) */}
                                {showSliderButtons && (
                                    <div className="slider_indicators">
                                        {postImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`slider_indicator ${index === currentImageIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            ></span>
                                        ))}
                                    </div>
                                )}
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



                        {/* Модальное окно */}
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
