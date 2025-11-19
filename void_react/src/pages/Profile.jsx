import React from 'react'
import Naw from '../components/Naw'
import '../css/Profile.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import { useSlider } from '../components/UI/posts/slider'
import { useCreate } from '../components/UI/profile/create'
import { useCategories } from '../components/UI/profile/categories'
import { useEditProfile } from '../components/UI/profile/edit_user'
import { useDeleteProfile as useDeleteProfileModal } from '../components/UI/profile/delete_profile'
import { useFileName } from '../components/UI/profile/file_avatar_name'
import { getUserPosts } from '../api/posts.api'
import { getAllCategories } from '../api/categories.api'
import { useImage } from '../components/UI/posts/post_image'
import { useReadMore } from '../components/UI/posts/read_more'
import { useDeletePostModal } from '../hooks/useDeletePostModal';

import { useFetchUserProfile } from '../hooks/profile/UserProfile';
import { useGetUserIdFromToken } from '../hooks/profile/GetUserIdFromToken';
import { useUserBan } from '../hooks/profile/useUserBan';
import { useCreatePost } from '../hooks/useCreatePost';
import { useEditPost } from '../hooks/useEditPost';
import { useDeletePost } from '../hooks/useDeletePost';

export default function Profile() {
    const { id } = useParams();
    
    // Хук для проверки бана
    const { isBanned } = useUserBan();
    
    // Хук для модального окна удаления профиля
    const { isDeleteModalOpen, OpenDelete, CloseDelete } = useDeleteProfileModal(false)
    
    const [isMyProfile, setIsMyProfile] = useState(true);
    const { sostCreate, OpenCreate, CloseCreate } = useCreate(false)
    const { sostCategories, OpenCategories, CloseCategories } = useCategories(false)
    const { sostEditProfile, OpenEditProfile, CloseEditProfile } = useEditProfile(false)
    const { FileChange, selectedFileName } = useFileName("")
    const { OpenModal, CloseModal, selectedImage } = useImage(null)

    // Хук для создания поста
    const {
        isOpen: createPostOpen,
        loading: createPostLoading,
        error: createPostError,
        postData,
        OpenCreate: openCreatePost,
        CloseCreate: closeCreatePost,
        handleInputChange: handlePostInputChange,
        handleFileChange: handlePostFileChange,
        removeImage,
        handleCreatePost
    } = useCreatePost(false);

    const {
        isOpen: editPostOpen,
        loading: editPostLoading,
        error: editPostError,
        postData: editPostData,
        OpenEdit: openEditPost,
        CloseEdit: closeEditPost,
        handleInputChange: handleEditPostInputChange,
        handleFileChange: handleEditPostFileChange,
        removeNewImage: removeEditPostNewImage,
        removeExistingImage: removeEditPostExistingImage,
        handleUpdatePost
    } = useEditPost(false);

    const {
        loading: deletePostLoading,
        error: deletePostError,
        deletePost: deletePostAction
    } = useDeletePost();

    const {
        isDeletePostModalOpen,
        postToDelete,
        OpenDeletePost,
        CloseDeletePost,
        ConfirmDeletePost,
        CancelDeletePost
    } = useDeletePostModal(false);

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [expandedPosts, setExpandedPosts] = useState({})
    const [currentImageIndexes, setCurrentImageIndexes] = useState({})

    // Хук для получения профиля пользователя
    const { user, setUser, fetchUserProfile } = useFetchUserProfile();

    // ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ТОКЕНА
    const { getUserIdFromToken } = useGetUserIdFromToken();

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
            const posts = await getUserPosts(userId);
            setUserPosts(posts);
        } catch (error) {
            console.error('❌ Ошибка загрузки постов:', error);
            setUserPosts([]);
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
            await fetchUserPosts(userId);
        } else {
            console.log('❌ Ошибка при создании поста');
        }
    };

    // Функция для обновления поста
    const handleSubmitEditPost = async () => {
        const updatedPost = await handleUpdatePost();
        if (updatedPost) {
            const userId = getUserIdFromToken();
            if (userId) {
                await fetchUserPosts(userId);
            }
        } else {
            console.log('❌ Ошибка при обновлении поста');
        }
    };

    // Функция для удаления профиля
    const handleDeleteProfile = async () => {
        const userId = getUserIdFromToken();
        if (userId) {
            console.log('🔄 Profile: Запускаем удаление профиля...');
            try {
                await deleteProfile(userId);
                console.log('✅ Profile: Удаление профиля завершено успешно');
            } catch (error) {
                console.error('❌ Profile: Ошибка при удалении профиля:', error);
            }
        }
    };

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
                                                        <button onClick={CloseDelete} className="Profile_cancel_btn">
                                                            Отмена
                                                        </button>
                                                        <button
                                                            className="Profile_delete_btn"
                                                            onClick={handleDeleteProfile}
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
                        
                        {/* ПРОСТОЕ РЕШЕНИЕ: если забанен - показываем сообщение, если нет - кнопку */}
                        {isBanned ? (
                            <div className="ban_message">
                                <p className="ban_text">❌ Ваш аккаунт забанен за нарушение правил публикации постов</p>
                                <p className="ban_subtext">Вы не можете создавать новые посты</p>
                            </div>
                        ) : (
                            <button className="Profile_tools_btn" onClick={openCreatePost}>
                                Создать новый пост
                            </button>
                        )}

                        {/* модальное окно - создание поста */}
                        {createPostOpen && (
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
                                                    {postData.images.length > 0 ?
                                                        `Выбрано ${postData.images.length} файл(ов)` :
                                                        'Выберите файл'
                                                    }
                                                </span>
                                            </label>
                                        </div>
                                        {postData.imagePreviews && postData.imagePreviews.length > 0 && (
                                            <div className="post_gallery">
                                                <h3 className="gallery_title">Выбранные изображения ({postData.imagePreviews.length})</h3>
                                                <div className="gallery_container">
                                                    {postData.imagePreviews.map((preview, index) => (
                                                        <div key={index} className="gallery_item">
                                                            <img
                                                                src={preview}
                                                                alt={`Изображение ${index + 1}`}
                                                                className="gallery_image"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="gallery_remove_btn"
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
                            userPosts.map(post => {
                                const postImages = post.images && post.images.length > 0
                                    ? post.images.map(img => {
                                        const fullUrl = `http://localhost:5000${img.image_url}`
                                        // console.log('🖼️ URL изображения:', fullUrl)
                                        return fullUrl
                                    })
                                    : [];

                                const currentIndex = currentImageIndexes[post.id] || 0
                                const showSliderButtons = postImages.length > 1
                                const isExpanded = expandedPosts[post.id] || false
                                const hasImages = postImages.length > 0

                                // Проверка на переполнение текста (простая версия)
                                const isOverflowed = post.text && post.text.length > 200

                                return (
                                    <div key={post.id} className="Posts_posts_post">
                                        <div className="post_actions">
                                            {/* Кнопка редактирования */}
                                            <div className="post_slider_button_edit">
                                                <button
                                                    className="post_slider_btn_edit"
                                                    onClick={() => openEditPost(post.id)}
                                                >
                                                    <img src="../src/uploads/profile/btn_edit.svg" alt="" className="post_slider_btn_edit_img" />
                                                </button>
                                            </div>
                                            {/* Кнопка удаления */}
                                            <div className="post_slider_button_delete">
                                                <button
                                                    className="post_slider_btn_delete"
                                                    onClick={() => OpenDeletePost(post.id)}
                                                    disabled={deletePostLoading}
                                                    title="Удалить пост"
                                                >
                                                    <img src="../src/uploads/profile/btn_delete.svg" alt="" className="post_slider_btn_delete_img" />
                                                </button>
                                            </div>
                                        </div>

                                        {hasImages && (
                                            <div className="post_slider">
                                                {/* Кнопки слайдера */}
                                                {showSliderButtons && (
                                                    <div className="post_slider_buttons">
                                                        <button className='post_slider_prev' onClick={() => handlePrevImage(post.id)}>
                                                            <img src="../src/uploads/posts/strelka.svg" alt="Предыдущее" className="post_slider_btn_img post_slider_btn_img_prev" />
                                                        </button>
                                                        <button className='post_slider_next' onClick={() => handleNextImage(post.id)}>
                                                            <img src="../src/uploads/posts/strelka.svg" alt="Следующее" className="post_slider_btn_img" />
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Изображение */}
                                                <div className="post_image">
                                                    <img
                                                        src={postImages[currentIndex]}
                                                        alt={`Изображение поста ${post.title}`}
                                                        className="post_image_img"
                                                        onClick={() => {
                                                            OpenModal(postImages[currentIndex])
                                                        }}
                                                    />
                                                </div>

                                                {/* Индикаторы слайдера */}
                                                {showSliderButtons && (
                                                    <div className="slider_indicators">
                                                        {postImages.map((_, index) => (
                                                            <span
                                                                key={index}
                                                                className={`slider_indicator ${index === currentIndex ? 'active' : ''}`}
                                                                onClick={() => handleSetImageIndex(post.id, index)}
                                                            ></span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="post_contant">
                                            <h3 className="post_title">{post.title}</h3>
                                            <div className={`post_text ${isExpanded ? 'expanded' : ''}`}>
                                                <p>{post.text}</p>
                                            </div>
                                            {isOverflowed && (
                                                <div className="read_more_button">
                                                    <button className="read_more_btn" onClick={() => handleToggleExpand(post.id)}>
                                                        {isExpanded ? 'Скрыть' : 'Читать далее'}
                                                    </button>
                                                </div>
                                            )}
                                            <div className="post_info">
                                                <p className="post_author">{post.user_post_ship?.login || user?.login}</p>
                                                <div className="post_status">
                                                    <span className={`status-badge status-${post.status}`}>
                                                        {post.status === 'Published' && 'Опубликовано'}
                                                        {post.status === 'Expectation' && 'На модерации'}
                                                        {post.status === 'Rejected' && 'Отклонено'}
                                                    </span>
                                                </div>
                                                <p className="post_date">
                                                    {post.created_at ? new Date(post.created_at).toLocaleDateString('ru-RU') : 'Дата не указана'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="no-posts">
                                <p>У вас пока нет постов. Создайте первый пост, нажав кнопку "Создать новый пост"</p>
                            </div>
                        )}
                    </div>


                    {/* Модалка редактирования поста */}
                    {editPostOpen && (
                        <div className="modal_overlay" onClick={closeEditPost}>
                            <div className="Profile_create_post" onClick={(e) => e.stopPropagation()}>
                                <h1 className="Profile_create_post_title">Редактировать пост</h1>

                                {editPostError && (
                                    <div className="error-message">{editPostError}</div>
                                )}

                                <div className="Profile_create_post_top_inp">
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder='Название поста'
                                        className='Profile_create_post_top_inp_name'
                                        value={editPostData.title}
                                        onChange={handleEditPostInputChange}
                                    />
                                    <select
                                        className='Profile_create_post_top_select'
                                        name="categoryId"
                                        value={editPostData.categoryId}
                                        onChange={handleEditPostInputChange}
                                        required>
                                        <option value="">Выберите категорию</option>
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
                                    value={editPostData.content}
                                    onChange={handleEditPostInputChange}
                                    rows="6"
                                />
                                <div className="Profile_create_post_photo">
                                    <p className="Profile_create_post_photo_p">Прикрепить фотографию (не обязательно)</p>
                                    <label className="Profile_create_post_photo_label">
                                        <input
                                            type="file"
                                            className='Profile_create_post_photo_inp'
                                            onChange={handleEditPostFileChange}
                                            accept="image/*"
                                            multiple
                                        />
                                        <span className="Profile_create_post_photo_text">
                                            {editPostData.images.length > 0 ?
                                                `Выбрано ${editPostData.images.length} файл(ов)` :
                                                'Выберите файл'
                                            }
                                        </span>
                                    </label>
                                </div>
                                {/* Существующие изображения */}
                                {editPostData.existingImages && editPostData.existingImages.length > 0 && (
                                    <div className="post_gallery">
                                        <h3 className="gallery_title">Текущие изображения ({editPostData.existingImages.length})</h3>
                                        <div className="gallery_container">
                                            {editPostData.existingImages.map((image) => (
                                                <div key={image.id} className="gallery_item">
                                                    <img
                                                        src={`http://localhost:5000${image.image_url}`}
                                                        alt="Изображение поста"
                                                        className="gallery_image"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="gallery_remove_btn"
                                                        onClick={() => removeEditPostExistingImage(image.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Новые изображения */}
                                {editPostData.imagePreviews && editPostData.imagePreviews.length > 0 && (
                                    <div className="post_gallery">
                                        <h3 className="gallery_title">Новые изображения ({editPostData.imagePreviews.length})</h3>
                                        <div className="gallery_container">
                                            {editPostData.imagePreviews.map((preview, index) => (
                                                <div key={index} className="gallery_item">
                                                    <img
                                                        src={preview}
                                                        alt={`Новое изображение ${index + 1}`}
                                                        className="gallery_image"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="gallery_remove_btn"
                                                        onClick={() => removeEditPostNewImage(index)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="Profile_create_post_buttons">
                                    <button
                                        className="Profile_create_post_btn"
                                        onClick={closeEditPost}
                                        disabled={editPostLoading}
                                    >
                                        Отменить
                                    </button>
                                    <button
                                        className="Profile_create_post_btn"
                                        onClick={handleSubmitEditPost}
                                        disabled={editPostLoading}
                                    >
                                        {editPostLoading ? 'Сохранение...' : 'Сохранить'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Модальное окно для увеличенного изображения поста */}
                    {selectedImage && (
                        <div className="modal_overlay" onClick={CloseModal}>
                            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                                <button className="modal_close" onClick={CloseModal}>×</button>
                                <img src={selectedImage} alt="Увеличенное изображение" className="modal_image" />
                            </div>
                        </div>
                    )}

                    {/* Модальное окно подтверждения удаления поста */}
                    {isDeletePostModalOpen && (
                        <div className="modal_overlay">
                            <div className="Profile_delete_modal">
                                <div className="filter_modal_close_container">
                                    <button className='filter_modal_close' onClick={CancelDeletePost}>✘</button>
                                </div>
                                <h3 className='Profile_delete_modal_title'>Подтверждение удаления</h3>
                                <p>Вы действительно хотите удалить этот пост? Это действие нельзя отменить.</p>
                                <div className="Profile_modal_buttons">
                                    <button onClick={CancelDeletePost} className="Profile_cancel_btn">
                                        Отмена
                                    </button>
                                    <button
                                        className="Profile_delete_btn"
                                        onClick={async () => {
                                            const userId = getUserIdFromToken();
                                            if (userId) {
                                                console.log('🔄 Profile: Запускаем удаление профиля...');
                                                try {
                                                    await deleteProfile(userId);
                                                    console.log('✅ Profile: Удаление профиля завершено успешно');
                                                } catch (error) {
                                                    console.error('❌ Profile: Ошибка при удалении профиля:', error);

                                                }
                                            }
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}