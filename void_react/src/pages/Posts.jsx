import React from 'react'
import Naw from '../components/Naw'
import { Link } from 'react-router-dom';
import '../css/Posts.css'

import { useState, useEffect } from 'react'
import { useImage } from '../components/UI/posts/post_image'
import { useFilter } from '../components/UI/posts/filter'
import { useSlider } from '../components/UI/posts/slider'
import { useReadMore } from '../components/UI/posts/read_more'
import { usePosts } from '../hooks/usePosts'

const API_URL = 'http://localhost:5000/api';

export default function Posts() {
    const { OpenModal, CloseModal, selectedImage } = useImage(null) // фотка поста в модальном окне
    const { contentRef, isOverflowed, isExpanded, toggleExpand } = useReadMore(400)


    // Состояния для постов
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Получение постов из БД
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/posts/`);

            if (!response.ok) {
                throw new Error(`Ошибка загрузки постов: ${response.status}`);
            }

            const postsData = await response.json();
            setPosts(postsData);
        } catch (err) {
            console.error('Ошибка при загрузке постов:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };


    // фильтр 
    const {
        sostFilter,
        OpenFilter,
        CloseFilter,
        categories,
        categoriesLoading,
        categoriesError,
        selectedCategories,
        handleCategorySelect,
        clearFilter,
        applyFilter
    } = useFilter()

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
                                        <h3 className="filter_modal_close_h3">Категории</h3>
                                        <button className='filter_modal_close' onClick={CloseFilter}>✘</button>
                                    </div>



                                    <div className="filter_modal_punkts">
                                        {categoriesLoading ? (
                                            <div className="loading">Загрузка категорий...</div>
                                        ) : categoriesError ? (
                                            <div className="error">{categoriesError}</div>
                                        ) : (
                                            categories.map(category => (
                                                <div key={category.id} className="filter_modal_punkt">
                                                    <input
                                                        type="checkbox"
                                                        className="filter_modal_punkt_inp"
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategorySelect(category.id)}
                                                    />
                                                    <p className="filter_modal_punkt_p">{category.name}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="filter_modal_actions">
                                        <button className="apply_filter_btn" onClick={applyFilter}>
                                            Применить фильтр
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="Posts_tools_find">
                            <input type="text" placeholder='Поиск по названию' className='Posts_tools_find_inp' />
                        </div>
                    </div>



                    <div className="Posts_posts">
                        {/* Состояние загрузки */}
                        {loading && (
                            <div className="posts_loading">
                                <p>Загрузка постов...</p>
                            </div>
                        )}

                        {/* Состояние ошибки */}
                        {error && (
                            <div className="posts_error">
                                <p>Ошибка: {error}</p>
                                <button onClick={fetchPosts} className="retry_btn">
                                    Попробовать снова
                                </button>
                            </div>
                        )}

                        {/* Список постов */}
                        {!loading && !error && posts.length === 0 && (
                            <div className="posts_empty">
                                <p>Пока нет постов</p>
                            </div>
                        )}
                        {!loading && !error && posts.map(post => {
                            // Для каждого поста создаем свой экземпляр хуков
                            const postImages = post.images && post.images.length > 0
                                ? post.images.map(img => `http://localhost:5000${img.image_url}`)
                                : ['../src/uploads/posts/default-post.jpg'];

                            return (
                                <PostComponent
                                    key={post.id}
                                    post={post}
                                    postImages={postImages}
                                    formatDate={formatDate}
                                    onImageClick={OpenModal}
                                />
                            );
                        })}



                        <div className="Posts_posts_post">
                            <div className="post_slider">
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
                                <div
                                    ref={contentRef}
                                    className={`post_text ${isExpanded ? 'expanded' : ''}`}
                                >
                                    <p>
                                        Хей, всем привет!
                                        <br /><br />
                                        Сегодня ходила в магазин за продуктами и увидела там это чудо. She's so sweet!
                                        Я просто не могла пройти мимо нее.
                                        <br /><br />
                                        Сегодня ходила в магазин за продуктами и увидела там это чудо. She's so sweet!
                                        Я просто не могла пройти мимо нее.
                                        <br /><br />
                                        один
                                        <br /><br />
                                        два
                                        <br /><br />
                                        три
                                        <br /><br />
                                        четыре

                                    </p>
                                </div>

                                {isOverflowed && (
                                    <div className="read_more_button">
                                        <button className="read_more_btn" onClick={toggleExpand}>
                                            {isExpanded ? 'Скрыть' : 'Читать далее'}
                                        </button>
                                    </div>
                                )}
                                <div className="post_info">
                                    <p className="post_author">Kron_prince</p>
                                    <p className="post_date">20.11.25</p>
                                </div>
                            </div>
                        </div>




                        {/* <div className="Posts_posts_post">
                            <div className="post_slider">
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
                                </div>*/}

                        {/* Индикатор текущего слайда (точки) */}
                        {/*  {showSliderButtons && (
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
                            <div className="post_slider">*/}
                        {/* Кнопки слайдера показываем только если нужно */}
                        {/*  {showSliderButtons && (
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
                                </div>*/}

                        {/* Индикатор текущего слайда (точки) */}
                        {/* {showSliderButtons && (
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
                            <div className="post_slider">*/}
                        {/* Кнопки слайдера показываем только если нужно */}
                        {/*  {showSliderButtons && (
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
                                </div>*/}

                        {/* Индикатор текущего слайда (точки) */}
                        {/*{showSliderButtons && (
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
                        </div> */}




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


        </>
    )
}


// Внутренний компонент для каждого поста
function PostComponent({ post, postImages, formatDate, onImageClick }) {
    const { OpenModal } = useImage(null)
    const { contentRef, isOverflowed, isExpanded, toggleExpand } = useReadMore(400)
    const { currentImageIndex, nextImage, prevImage, showSliderButtons, setCurrentImageIndex } = useSlider(postImages);

    return (
        <div className="Posts_posts_post">
            <div className="post_slider">
                {showSliderButtons && postImages.length > 1 && (
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
                        alt={`Изображение поста ${post.title}`}
                        className="post_image_img"
                        onClick={() => onImageClick(postImages[currentImageIndex])}
                    />
                </div>

                {/* Индикатор текущего слайда (точки) */}
                {showSliderButtons && postImages.length > 1 && (
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
                <h3 className="post_title">{post.title}</h3>
                <div
                    ref={contentRef}
                    className={`post_text ${isExpanded ? 'expanded' : ''}`}
                >
                    <p>{post.text}</p>
                </div>
                {isOverflowed && (
                    <div className="read_more_button">
                        <button className="read_more_btn" onClick={toggleExpand}>
                            {isExpanded ? 'Скрыть' : 'Читать далее'}
                        </button>
                    </div>
                )}
                <div className="post_info">
                    <Link to={`/profile/${post.user_post_ship?.id || post.user_id}`} className='Link'>
                        <p className="post_author">
                            {post.user_post_ship?.login || 'Неизвестный автор'}
                        </p>
                    </Link>
                    <p className="post_date">
                        {formatDate(post.created_at)}
                    </p>
                </div>
            </div>
        </div>
    );
}
