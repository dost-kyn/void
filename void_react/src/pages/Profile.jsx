import React from 'react'
import Naw from '../components/Naw'
import '../css/Profile.css'

import { useSlider } from '../components/UI/posts/slider'
import { useCreate } from '../components/UI/profile/create'
import { useCategories } from '../components/UI/profile/categories'
import { useEditProfile } from '../components/UI/profile/edit_user'
import { useDeleteProfile } from '../components/UI/profile/delete_profile'

export default function Profile() {
    const { sostCreate, OpenCreate, CloseCreate } = useCreate(false)
    const { sostCategories, OpenCategories, CloseCategories } = useCategories(false)
    const { sostEditProfile, OpenEditProfile, CloseEditProfile, } = useEditProfile(false)
    const { isDeleteModalOpen, OpenDelete, CloseDelete, DeleteProfile, СancelDeleteProfile } = useDeleteProfile(false)


    // Массив изображений для поста
    const postImages = [
        "../src/uploads/posts/post_1.jpg",
        "../src/uploads/posts/post_2.jpg",
        "../src/uploads/posts/post_3.jpg",
    ];

    const { currentImageIndex, nextImage, prevImage, showSliderButtons } = useSlider(postImages);

    return (
        <>
            <div className="body">
                <Naw />
                <div className="Profile">

                    <h1 className="Posts_title">Профиль</h1>

                    <div className="Profile_user">
                        <div className="Profile_user_column">
                            {sostEditProfile ? (
                                <div className="Profile_user_avatar">
                                    <img src="../src/uploads/profile/avatar.jpg" alt="" className="Profile_user_avatar_img" />
                                    <p className="Profile_user_avatar_file_title">Сменить фото</p>
                                    <input
                                        type="file"
                                        className="Profile_user_avatar_file_img"
                                    />
                                </div>
                            ) : (
                                <div className="Profile_user_avatar">
                                    <img src="../src/uploads/profile/avatar.jpg" alt="" className="Profile_user_avatar_img" />
                                </div>
                            )}
                            {sostEditProfile ? (
                                <div className="Profile_user_avatar_info_edit">
                                    <input
                                        type="text"
                                        className="Profile_user_avatar_info_input"
                                        defaultValue="Имя пользователя"
                                        placeholder="Имя пользователя"
                                    />
                                    <input
                                        type="text"
                                        className="Profile_user_avatar_info_input"
                                        defaultValue="Логин" // или значение из состояния
                                        placeholder="Логин"
                                    />
                                    <input
                                        type="text"
                                        className="Profile_user_avatar_info_input"
                                        defaultValue="Пароль" // или значение из состояния
                                        placeholder="Пароль"
                                    />
                                </div>
                            ) : (
                                <div className="Profile_user_avatar_info">
                                    <p className="Profile_user_avatar_info_p">Имя пользователя</p>
                                    <p className="Profile_user_avatar_info_p">Логин</p>
                                </div>
                            )}
                        </div>

                        <div className="Profile_user_column">
                            <div className="Profile_user_column_buttons">


                                {sostCategories && (
                                    <div className="Profile_user_categories">
                                        <div className="Profile_user_categories_modal">
                                            <div className="Profile_modal_close_container">
                                                <button className='Profile_modal_close' onClick={CloseCategories}>✘</button>
                                            </div>

                                            <div className="Profile_modal_punkts">
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>
                                                <div className="Profile_modal_punkt">
                                                    <input type="checkbox" className="Profile_modal_punkt_inp" />
                                                    <p className="Profile_modal_punkt_p">Животные</p>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                )}


                                <div className="Profile_user_column_button">
                                    {sostEditProfile && (
                                        <button className="Profile_user_column_button_btn Profile_user_column_button_btn_del"
                                            onClick={OpenDelete}>
                                            Удалить профиль
                                        </button>
                                    )}
                                    {/* Модальное окно подтверждения удаления профиля */}
                                    {isDeleteModalOpen && (
                                        <div className="modal_overlay">
                                            <div className="Profile_delete_modal">
                                                <div className="filter_modal_close_container">
                                                    <button className='filter_modal_close' onClick={CloseDelete}>✘</button>
                                                </div>
                                                <h3 className='Profile_delete_modal_title'>Подтверждение удаления</h3>
                                                <p>Вы действительно хотите удалить профиль? Это действие нельзя отменить.</p>
                                                <div className="Profile_modal_buttons">
                                                    <button onClick={СancelDeleteProfile} className="Profile_cancel_btn">
                                                        Отмена
                                                    </button>
                                                    <button onClick={DeleteProfile} className="Profile_delete_btn">
                                                        Удалить
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {sostEditProfile && (
                                        <button className="Profile_user_column_button_btn"
                                            onClick={sostCategories ? CloseCategories : OpenCategories}>
                                            Предпочитаемые категории ∨
                                        </button>
                                    )}
                                </div>


                                <div className="Profile_user_column_button">
                                    {sostEditProfile ? (
                                        <button className="Profile_user_column_button_btn"
                                            onClick={sostEditProfile ? CloseEditProfile : OpenEditProfile}
                                        >
                                            Сохранить
                                        </button>
                                    ) : (
                                        <button className="Profile_user_column_button_btn"
                                            onClick={sostEditProfile ? CloseEditProfile : OpenEditProfile}>
                                            Редактирование профиля
                                        </button>
                                    )}

                                </div>
                            </div>

                        </div>
                    </div>


                    <div className="Profile_tools">
                        <h2 className="Profile_tools_title">Мои посты</h2>
                        <button className="Profile_tools_btn" onClick={OpenCreate} >Создать новый пост</button>

                        {sostCreate && (
                            <>
                                {/* Затемнение фона */}
                                <div className="modal_overlay" onClick={CloseCreate}>
                                    <div className="Profile_create_post" onClick={(e) => e.stopPropagation()}>
                                        <h1 className="Profile_create_post_title">Новый пост</h1>
                                        <div className="Profile_create_post_top_inp">
                                            <input
                                                type="text"
                                                placeholder='Название поста'
                                                className='Profile_create_post_top_inp_name'
                                            />
                                            <select className='Profile_create_post_top_select' required>
                                                <option value="" disabled selected>Категория</option>
                                                <option value="cats">Котики</option>
                                                <option value="cook">Кулинария</option>
                                            </select>
                                        </div>
                                        <textarea
                                            className="Profile_create_post_inp"
                                            placeholder='Текст'
                                        />
                                        <div className="Profile_create_post_photo">
                                            <p className="Profile_create_post_photo_p">Прикрепить фотографию (не обязательно)</p>
                                            <label className="Profile_create_post_photo_label">
                                                <input
                                                    type="file"
                                                    className='Profile_create_post_photo_inp'
                                                />
                                                <span className="Profile_create_post_photo_text">Выберите файл</span>
                                            </label>
                                        </div>
                                        <div className="Profile_create_post_buttons">
                                            <button className="Profile_create_post_btn" onClick={CloseCreate}>Отменить</button>
                                            <button className="Profile_create_post_btn">Опубликовать</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>



                    <div className="Posts_posts">
                        <div className="Posts_posts_post">
                            <div className="post_slider">

                                <div className="post_slider_button_edit">
                                    <button className="post_slider_btn_edit" >
                                        <img src="../src/uploads/profile/btn_edit.svg" alt="" className="post_slider_btn_edit_img" />
                                    </button>
                                </div>



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
                    </div>

                </div>
            </div>
        </>
    )
}