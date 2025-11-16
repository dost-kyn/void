import React from 'react'
import Naw from '../components/Naw'
import '../css/Profile.css'
import { useState, useEffect } from 'react'

import { useSlider } from '../components/UI/posts/slider'
import { useCreate } from '../components/UI/profile/create'
import { useCategories } from '../components/UI/profile/categories'
import { useEditProfile } from '../components/UI/profile/edit_user'
import { useDeleteProfile } from '../components/UI/profile/delete_profile'
import { useFileName } from '../components/UI/profile/file_avatar_name'
import { findUser, delProfile, updateUser, updateUserWithPhoto } from '../api/users.api'

import { getUserPosts } from '../api/posts.api'
import { getAllCategories } from '../api/categories.api'
import { useCreatePost } from '../hooks/useCreatePost'

export default function Profile() {
    const { sostCreate, OpenCreate, CloseCreate } = useCreate(false)
    const { sostCategories, OpenCategories, CloseCategories } = useCategories(false)
    const { sostEditProfile, OpenEditProfile, CloseEditProfile } = useEditProfile(false)
    const { isDeleteModalOpen, OpenDelete, CloseDelete, DeleteProfile, СancelDeleteProfile } = useDeleteProfile(false)
    const { FileChange, selectedFileName } = useFileName("")


    // хук
    const {
        isOpen: createPostOpen,
        loading: createPostLoading,
        error: createPostError,
        postData,
        OpenCreate: openCreatePost,
        CloseCreate: closeCreatePost,
        handleInputChange: handlePostInputChange,
        handleFileChange: handlePostFileChange,
        handleCreatePost
    } = useCreatePost(false)


    const [categories, setCategories] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [userPosts, setUserPosts] = useState([])



    // ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ПРОФИЛЯ
    const fetchUserProfile = async (userId) => {
        try {
            const userData = await findUser(userId)
            setUser(userData)
        } catch (error) {
            console.error('Ошибка загрузки профиля:', error)
        }
    }

    // ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ТОКЕНА
    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token')
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]))
            return payload.id
        }
        return null
    }

    // ФУНКЦИЯ ДЛЯ УДАЛЕНИЯ ПРОФИЛЯ
    const deleteProfile = async (userId) => {
        try {
            const result = await delProfile(userId)
            console.log('Профиль удален:', result)

            localStorage.removeItem('token')
            window.location.href = '/'
        } catch (error) {
            console.error('Ошибка удаления профиля:', error)
        }
    }

    // ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ПРОФИЛЯ
    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const userId = getUserIdFromToken()
            if (!userId) {
                alert('Ошибка: пользователь не авторизован')
                return
            }

            let result
            const updateData = {
                name: user.name,
                last_name: user.last_name,
                login: user.login,
                email: user.email || ''
            }

            if (photo) {
                // Если есть фото, используем FormData
                const formDataObj = new FormData()
                formDataObj.append('photo', photo)

                // Добавляем текстовые поля
                Object.keys(updateData).forEach(key => {
                    if (updateData[key] !== undefined) {
                        formDataObj.append(key, updateData[key])
                    }
                })

                result = await updateUserWithPhoto(userId, formDataObj)
            } else {
                // Если нет фото, отправляем JSON
                result = await updateUser(userId, updateData)
            }

            if (result.user) {
                // Обновляем данные в состоянии
                setUser(result.user)
                alert('Данные успешно обновлены!')
                CloseEditProfile() // Закрываем режим редактирования
            } else if (result.message) {
                alert(result.message)
            }
        } catch (error) {
            console.error('Ошибка обновления:', error)
            alert('Ошибка при обновлении данных')
        } finally {
            setLoading(false)
            setPhoto(null)
        }
    }

    // Обработчик изменения файла аватара
    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPhoto(file)
            FileChange(e) // для отображения имени файла
        }
    }

    // Обработчик изменения текстовых полей
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUser(prev => ({
            ...prev,
            [name]: value
        }))
    }



    // Функция для получения категорий
    const fetchCategories = async () => {
        try {
            const categoriesData = await getAllCategories()
            setCategories(categoriesData)
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error)
        }
    }


    // Функция для получения постов пользователя
    const fetchUserPosts = async (userId) => {
        try {
            const posts = await getUserPosts(userId)
            setUserPosts(posts)
        } catch (error) {
            console.error('Ошибка загрузки постов:', error)
            setUserPosts([]) // на всякий случай пустой массив
        }
    }

    // Функция для создания поста
    const handleSubmitPost = async () => {
        const userId = getUserIdFromToken()
        if (!userId) {
            alert('Ошибка: пользователь не авторизован')
            return
        }

        const success = await handleCreatePost(userId)
        if (success) {
            // Обновляем список постов после успешного создания
            fetchUserPosts(userId)
        }
    }





    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        const userId = getUserIdFromToken()
        if (userId) {
            fetchUserProfile(userId)
            fetchUserPosts(userId)
            fetchCategories()
        }
    }, [])

    // Сбрасываем фото при выходе из режима редактирования
    useEffect(() => {
        if (!sostEditProfile) {
            setPhoto(null)
        }
    }, [sostEditProfile])

    console.log('User data:', user)
    console.log('User avatar:', user?.avatar)

    // Массив изображений для поста
    const postImages = [
        "../src/uploads/posts/post_1.jpg",
        "../src/uploads/posts/post_2.jpg",
        "../src/uploads/posts/post_3.jpg",
    ]

    const { currentImageIndex, nextImage, prevImage, showSliderButtons } = useSlider(postImages)

    return (
        <>
            <div className="body">
                <Naw />
                <div className="Profile">
                    <h1 className="Posts_title">Профиль</h1>

                    {user && (
                        <div className="Profile_user">
                            <div className="Profile_user_column">
                                {sostEditProfile ? (
                                    <div className="Profile_user_avatar">
                                        <img
                                            src={photo ? URL.createObjectURL(photo) : (user?.avatar ? `http://localhost:5000${user.avatar}` : "../src/uploads/default_avatar.jpg")}
                                            alt=""
                                            className="Profile_user_avatar_img"
                                        />
                                        <label className="Profile_user_avatar_file_label">
                                            <input
                                                type="file"
                                                className="Profile_user_avatar_file_input"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                            />
                                            <span className="Profile_user_avatar_file_text">
                                                {selectedFileName || 'Сменить фото'}
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="Profile_user_avatar">
                                        <img
                                            src={user?.avatar ? `http://localhost:5000${user.avatar}` : "../src/uploads/default_avatar.jpg"}
                                            alt=""
                                            className="Profile_user_avatar_img"
                                        />
                                    </div>
                                )}

                                {sostEditProfile ? (
                                    <div className="Profile_user_avatar_info_edit">
                                        <input
                                            type="text"
                                            name="name"
                                            className="Profile_user_avatar_info_input"
                                            value={user.name || ''}
                                            onChange={handleInputChange}
                                            placeholder="Имя пользователя"
                                        />
                                        <input
                                            type="text"
                                            name="last_name"
                                            className="Profile_user_avatar_info_input"
                                            value={user.last_name || ''}
                                            onChange={handleInputChange}
                                            placeholder="Фамилия пользователя"
                                        />
                                        <input
                                            type="text"
                                            name="login"
                                            className="Profile_user_avatar_info_input"
                                            value={user.login || ''}
                                            onChange={handleInputChange}
                                            placeholder="Логин"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            className="Profile_user_avatar_info_input"
                                            value={user.email || ''}
                                            onChange={handleInputChange}
                                            placeholder="Email"
                                        />
                                    </div>
                                ) : (
                                    <div className="Profile_user_avatar_info">
                                        <p className="Profile_user_avatar_info_p">{user.name} {user.last_name}</p>
                                        <p className="Profile_user_avatar_info_p">{user.login}</p>
                                        {user.email && <p className="Profile_user_avatar_info_p">{user.email}</p>}
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
                                            <button
                                                className="Profile_user_column_button_btn Profile_user_column_button_btn_del"
                                                onClick={OpenDelete}
                                            >
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
                                                        <button
                                                            className="Profile_delete_btn"
                                                            onClick={() => {
                                                                const userId = getUserIdFromToken()
                                                                if (userId) {
                                                                    deleteProfile(userId)
                                                                }
                                                            }}
                                                        >
                                                            Удалить
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {sostEditProfile && (
                                            <button
                                                className="Profile_user_column_button_btn"
                                                onClick={sostCategories ? CloseCategories : OpenCategories}
                                            >
                                                Предпочитаемые категории ∨
                                            </button>
                                        )}
                                    </div>

                                    <div className="Profile_user_column_button">
                                        {sostEditProfile ? (
                                            <div className="Profile_user_column_button_btns">
                                                <button
                                                    className="Profile_user_column_button_btn"
                                                    onClick={handleUpdateProfile}
                                                    disabled={loading}
                                                >
                                                    {loading ? 'Сохранение...' : 'Сохранить'}
                                                </button>
                                                <button
                                                    className="Profile_user_column_button_btn Profile_user_column_button_btn_cancel"
                                                    onClick={CloseEditProfile}
                                                    disabled={loading}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="Profile_user_column_button_btn"
                                                onClick={OpenEditProfile}
                                            >
                                                Редактирование профиля
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="Profile_tools">
                        <h2 className="Profile_tools_title">Мои посты</h2>
                        <button className="Profile_tools_btn" onClick={openCreatePost}>Создать новый пост</button>

                        {createPostOpen  && (
                            <>
                                <div className="modal_overlay" onClick={closeCreatePost}>
                                    <div className="Profile_create_post" onClick={(e) => e.stopPropagation()}>
                                        <h1 className="Profile_create_post_title">Новый пост</h1>
                                        {/* {error && ( 
                                            <div className="error-message">{error}</div>
                                        )} */}
                                        <div className="Profile_create_post_top_inp">
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder='Название поста'
                                                className='Profile_create_post_top_inp_name'
                                                value={postData.title}
                                                onChange={handlePostInputChange}
                                            />
                                            <select
                                                className='Profile_create_post_top_select'
                                                name="categoryId"
                                                value={postData.categoryId}
                                                onChange={handlePostInputChange}
                                                required>
                                                <option value="" disabled>Выберите категорию</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <textarea
                                            className="Profile_create_post_inp"
                                            placeholder='Текст'
                                            name="content"
                                            value={postData.content}
                                            onChange={handlePostInputChange}
                                            rows="6"
                                        />
                                        <div className="Profile_create_post_photo">
                                            <p className="Profile_create_post_photo_p">Прикрепить фотографию (не обязательно)</p>
                                            <label className="Profile_create_post_photo_label">
                                                <input
                                                    type="file"
                                                    className='Profile_create_post_photo_inp'
                                                    onChange={handlePostFileChange}
                                                    accept="image/*"
                                                />
                                                <span className="Profile_create_post_photo_text">
                                                    {postData.image ? postData.image.name : 'Выберите файл'}
                                                </span>
                                            </label>
                                        </div>
                                        <div className="Profile_create_post_buttons">
                                            <button
                                                className="Profile_create_post_btn"
                                                onClick={CloseCreate}
                                                disabled={createPostLoading}
                                            >
                                                Отменить</button>
                                            <button className="Profile_create_post_btn"
                                                onClick={handleSubmitPost}
                                                disabled={createPostLoading}
                                            >
                                                {createPostLoading ? 'Публикация...' : 'Опубликовать'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>




                    <div className="Posts_posts">
                        {userPosts && userPosts.length > 0 ? (
                            userPosts.map(post => (
                                <div key={post.id} className="Posts_posts_post">
                                    {/* <div className="post_slider">
                                        {post.image && (
                                            <>
                                                <div className="post_slider_button_edit">
                                                    <button className="post_slider_btn_edit">
                                                        <img src="../src/uploads/profile/btn_edit.svg" alt="" className="post_slider_btn_edit_img" />
                                                    </button>
                                                </div>

                                                <div className="post_image">
                                                    <img
                                                        src={`http://localhost:5000${post.image}`}
                                                        alt={post.title}
                                                        className="post_image_img"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div> */}

                                    <div className="post_contant">
                                        <h3 className="post_title">{post.title}</h3>
                                        <p className="post_text">{post.text}</p>
                                        <div className="post_info">
                                            <p className="post_author">{user.login}</p>
                                            <p className="post_date">
                                                {post.created_at ? new Date(post.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                                            </p>
                                            {post.category && (
                                                <p className="post_category">Категория: {post.category.name}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-posts">
                                <p>У вас пока нет постов. Создайте первый пост, нажав кнопку "Создать новый пост"</p>
                            </div>
                        )}
                    </div>



                    {/* <div className="Posts_posts">
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
                                    />
                                </div>

                                {showSliderButtons && (
                                    <div className="slider_indicators">
                                        {postImages.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`slider_indicator ${index === currentImageIndex ? 'active' : ''}`}
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
                    </div> */}



                </div>
            </div>
        </>
    )
}