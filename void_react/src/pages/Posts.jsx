import React from 'react'
import Naw from '../components/Naw'
import { Link } from 'react-router-dom';
import '../css/Posts.css'

import { useState, useEffect } from 'react'
import { useImage } from '../components/UI/posts/post_image'
import { useSlider } from '../components/UI/posts/slider'
import { useReadMore } from '../components/UI/posts/read_more'

const API_URL = 'http://localhost:5000/api';

export default function Posts() {
    const { OpenModal, CloseModal, selectedImage } = useImage(null)
    const { contentRef, isOverflowed, isExpanded, toggleExpand } = useReadMore(400)

    // Состояния
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // Все посты для фильтрации
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Состояния для фильтра
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

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
            const publishedPosts = postsData.filter(post => post.status === 'Published');

            console.log('📥 Загружено постов:', publishedPosts.length);
            console.log('📊 Категории постов:', publishedPosts.map(p => ({
                id: p.id, 
                category: p.category_id, 
                title: p.title
            })));

            setAllPosts(publishedPosts);
            setPosts(publishedPosts);

        } catch (err) {
            console.error('Ошибка при загрузке постов:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Получение категорий из БД
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/categories/`);
            if (response.ok) {
                const categoriesData = await response.json();
                console.log('📋 Загружены категории:', categoriesData);
                setCategories(categoriesData);
            }
        } catch (err) {
            console.error('Ошибка при загрузке категорий:', err);
        }
    };

    // Функции для фильтра
    const openFilter = () => setIsFilterOpen(true);
    const closeFilter = () => setIsFilterOpen(false);

    const handleCategorySelect = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const applyFilter = () => {
        console.log('🔍 Применяем фильтр по категориям:', selectedCategories);
        
        if (selectedCategories.length === 0) {
            // Если не выбрано категорий - показываем все посты
            setPosts(allPosts);
            console.log('📊 Показываем все посты:', allPosts.length);
        } else {
            // Фильтруем посты по выбранным категориям
            const filteredPosts = allPosts.filter(post => {
                const hasCategory = selectedCategories.includes(post.category_id);
                console.log(`Пост "${post.title}" (категория ${post.category_id}) - подходит: ${hasCategory}`);
                return hasCategory;
            });
            
            console.log('📊 Отфильтровано постов:', filteredPosts.length);
            setPosts(filteredPosts);
        }
        closeFilter();
    };

    const clearFilter = () => {
        setSelectedCategories([]);
        setPosts(allPosts);
        console.log('🔄 Фильтр сброшен, показываем все посты:', allPosts.length);
    };

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <>
            <div className="body">
                <Naw />

                <div className="Posts">
                    <h1 className="Posts_title">Посты</h1>

                    <div className="Posts_tools">
                        <div className="Posts_tools_filter">
                            <button className="Posts_tools_filter_button" onClick={openFilter}>
                                <img src="../src/uploads/filter.svg" alt="" className="Posts_tools_filter_img" />
                                <h2 className="Posts_tools_filter_title">Фильтр</h2>
                                {/* {selectedCategories.length > 0 && (
                                    <span className="filter_badge">{selectedCategories.length}</span>
                                )} */}
                            </button>

                            {/* Модальное окно фильтра */}
                            {isFilterOpen && (
                                <div className="filter_modal">
                                    <div className="filter_modal_close_container">
                                        <h3 className="filter_modal_close_h3">Категории</h3>
                                        <button className='filter_modal_close' onClick={closeFilter}>✘</button>
                                    </div>

                                    <div className="filter_modal_punkts">
                                        {categories.length === 0 ? (
                                            <div className="loading">Загрузка категорий...</div>
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
                                        {/* <button 
                                            className="clear_filter_btn" 
                                            onClick={clearFilter}
                                            disabled={selectedCategories.length === 0}
                                        >
                                            Сбросить
                                        </button> */}
                                        <button 
                                            className="apply_filter_btn" 
                                            onClick={applyFilter}
                                        >
                                            Применить фильтр ({selectedCategories.length})
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="Posts_tools_find">
                            <input type="text" placeholder='Поиск по названию' className='Posts_tools_find_inp' />
                        </div>
                    </div>

                    {/* Индикатор активного фильтра */}
                    {/* {selectedCategories.length > 0 && (
                        <div className="active_filter_info">
                            <p>Активный фильтр: {selectedCategories.length} категорий</p>
                            <button onClick={clearFilter} className="clear_filter_small_btn">
                                Сбросить
                            </button>
                        </div>
                    )} */}

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
                                <p>
                                    {selectedCategories.length > 0 
                                        ? 'Нет постов в выбранных категориях' 
                                        : 'Пока нет постов'
                                    }
                                </p>
                                {/* {selectedCategories.length > 0 && (
                                    <button onClick={clearFilter} className="Link">
                                        Показать все посты
                                    </button>
                                )} */}
                            </div>
                        )}
                        
                        {!loading && !error && posts.map(post => {
                            const postImages = post.images && post.images.length > 0
                                ? post.images.map(img => `http://localhost:5000${img.image_url}`)
                                : [];

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
                    </div>

                    {/* Модальное окно с изображением */}
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
    const { contentRef, isOverflowed, isExpanded, toggleExpand } = useReadMore(400)
    const { currentImageIndex, nextImage, prevImage, showSliderButtons, setCurrentImageIndex } = useSlider(postImages);

    const hasImages = postImages && postImages.length > 0;

    return (
        <div className="Posts_posts_post">
            {hasImages && (
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
            )}

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
                    <Link to={`/user/${post.user_post_ship?.id || post.user_id}`} className='Link'>
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