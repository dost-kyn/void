import React from 'react'
import '../css/Authorization.css'
import { Link } from 'react-router-dom';
import { useRegistration } from '../hooks/useRegistration';
import { 
    handleFileChange, 
    handleChange, 
    handleSubmit, 
    getSelectedCategoryNames 
} from '../hooks/useRegistration';

export default function Registration() {
    const {
        // Состояния
        preview,
        formData,
        errors,
        loading,
        
        // Функции состояния
        setPreview,
        setFormData,
        setErrors,
        setLoading,
        
        // Функции фильтра
        sostFilter,
        OpenFilter,
        CloseFilter,
        categories,
        categoriesError,
        selectedCategories,
        handleCategorySelect
    } = useRegistration();

    // Оборачиваем функции для передачи параметров
    const handleFileChangeLocal = (e) => handleFileChange(e, setPreview, setFormData);
    const handleChangeLocal = (e) => handleChange(e, formData, setFormData, errors, setErrors);
    const handleSubmitLocal = (e) => handleSubmit(e, formData, selectedCategories, setErrors, setLoading);

    return (
        <>
            <div className="body">
                <div className="Auth">
                    <form className='form' onSubmit={handleSubmitLocal}>
                        <h1 className='title'>Регистрация пилота</h1>

                        {/* Имя */}
                        <input
                            className={`firstName ${errors.firstName ? 'error' : ''}`}
                            type="text"
                            name="firstName"
                            placeholder='Имя'
                            value={formData.firstName}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.firstName && <div className="error_message">{errors.firstName}</div>}

                        {/* Фамилия */}
                        <input
                            className={`surname ${errors.surname ? 'error' : ''}`}
                            type="text"
                            name="surname"
                            placeholder='Фамилия'
                            value={formData.surname}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.surname && <div className="error_message">{errors.surname}</div>}

                        {/* Логин */}
                        <input
                            className={`login ${errors.login ? 'error' : ''}`}
                            type="text"
                            name="login"
                            placeholder='Логин'
                            value={formData.login}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.login && <div className="error_message">{errors.login}</div>}

                        {/* Email */}
                        <input
                            className={`email ${errors.email ? 'error' : ''}`}
                            type="email"
                            name="email"
                            placeholder='Email'
                            value={formData.email}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.email && <div className="error_message">{errors.email}</div>}

                        {/* Пароль */}
                        <input
                            className={`password ${errors.password ? 'error' : ''}`}
                            type="password"
                            name="password"
                            placeholder='Пароль'
                            value={formData.password}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.password && <div className="error_message">{errors.password}</div>}

                        {/* Повтор пароля */}
                        <input
                            className={`repeatPassword ${errors.repeatPassword ? 'error' : ''}`}
                            type="password"
                            name="repeatPassword"
                            placeholder='Повторите пароль'
                            value={formData.repeatPassword}
                            onChange={handleChangeLocal}
                            required
                            disabled={loading}
                        />
                        {errors.repeatPassword && <div className="error_message">{errors.repeatPassword}</div>}

                        {/* Категории */}
                        <p className='p_select'>Выбор интересующих категорий (не обязательно)</p>

                        <div className="Posts_tools_filter">
                            <button 
                                type="button" 
                                className="Reg_category_btn" 
                                onClick={OpenFilter}
                                disabled={selectedCategories.length >= 3 || loading} 
                            >
                                {selectedCategories.length === 0 
                                    ? 'Выберите категории' 
                                    : `Выбрано ${selectedCategories.length}/3 категорий`
                                }
                            </button>

                            {/* Фильтр */}
                            {sostFilter && (
                                <div className="Reg_category_modal">
                                    <div className="filter_modal_close_container">
                                        <h3 className="Reg_category_modal_close_h3">
                                            Категории ({selectedCategories.length}/3)
                                        </h3>
                                        <button className='filter_modal_close' onClick={CloseFilter}>✘</button>
                                    </div>

                                    <div className="filter_modal_punkts">
                                        {categoriesError ? (
                                            <div className="error">{categoriesError}</div>
                                        ) : (
                                            categories.map(category => (
                                                <div key={category.id} className="filter_modal_punkt">
                                                    <input
                                                        type="checkbox"
                                                        className="filter_modal_punkt_inp"
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategorySelect(category.id)}
                                                        disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category.id)}
                                                    />
                                                    <p className="Reg_category_modal_punkt_p">{category.name}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Аватар */}
                        <p className='p_select2'>Фото профиля (не обязательно)</p>
                        <div className="avatar_upload">
                            <label className="file_input_label">
                                Выберите файл
                                <input
                                    type="file"
                                    onChange={handleFileChangeLocal}
                                    accept="image/*"
                                    className="file_input"
                                    name="avatar"
                                    disabled={loading}
                                />
                            </label>

                            {preview && (
                                <div className="avatar_preview">
                                    <img src={preview} alt="Avatar preview" />
                                </div>
                            )}
                        </div>

                        {/* Согласие */}
                        <div className="content_checkbox">
                            <input
                                type="checkbox"
                                className={`checkbox ${errors.agree ? 'error' : ''}`}
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChangeLocal}
                                disabled={loading}
                            />
                            <p className="checkbox_p">Согласие на обработку персональных данных</p>
                        </div>
                        {errors.agree && <div className="error_message">{errors.agree}</div>}

                        {/* Общие ошибки */}
                        {errors.general && <div className="error_message general_error">{errors.general}</div>}

                        {/* Кнопка отправки */}
                        <div className="button">
                            <button
                                className='btn'
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Регистрируем...' : 'Запуск!'}
                            </button>
                        </div>

                        <p className='already'>У вас уже есть аккаунт? <Link to="/authorization" className='link_already'>Авторизироваться</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}