import React from 'react'
import '../../css/Admin_panel.css'
import { useState } from 'react';

import Naw_Admin_panel from '../../components/Naw_Admin_panel'
import { useCategories } from '../../hooks/useCategories'


export default function AdminCategories() {
    const {
        categories,
        loading,
        apiError,
        createCategory,
        updateCategory, 
        deleteCategory  
    } = useCategories()

    // UI состояние для модалок и форм
    // const { soslDelCategory, OpenDelCategory, CloseDelCategory } = useDelCategory(false)
    // const { inp, setInp, CreareCategory, textError } = useCreateCategory('')
    // const { sostEdit, tdtext, setTdText, OpenRedactor, CloseRedactor } = useEditCategory();

    // Дополнительное состояние
    const [inp, setInp] = useState(''); // для создания категории
    const [textError, setTextError] = useState(''); // ошибки валидации
    const [soslDelCategory, setSoslDelCategory] = useState(false); // модалка удаления
    const [categoryToDelete, setCategoryToDelete] = useState(null); // какую категорию удаляем
    const [editingId, setEditingId] = useState(null); // какая категория редактируется
    const [editText, setEditText] = useState(''); // текст для редактирования

    // Функция создания категории
    const handleCreateCategory = async () => {
        if (!inp.trim()) {
            setTextError('Категорию нельзя создать - поле пустое');
            return;
        }
        
        setTextError('');
        const success = await createCategory(inp);
        if (success) {
            setInp(''); 
        }
    };

    // Функция открытия редактирования
    const OpenRedactor = (category) => {
        setEditingId(category.id);
        setEditText(category.name);
    };

    // Функция сохранения редактирования
    const SaveRedactor = async (id) => {
        if (!editText.trim()) {
            setTextError('Название категории не может быть пустым');
            return;
        }
        setTextError('');
        const success = await updateCategory(id, editText);
        if (success) {
            setEditingId(null);
            setEditText('');
        }
    };

    // Функция отмены редактирования
    const CancelRedactor = () => {
        setEditingId(null);
        setEditText('');
        setTextError('');
    };

    // Функция открытия модалки удаления
    const OpenDelCategory = (category) => {
        setCategoryToDelete(category);
        setSoslDelCategory(true);
    };

    // Функция закрытия модалки удаления
    const CloseDelCategory = () => {
        setCategoryToDelete(null);
        setSoslDelCategory(false);
    };

    // Функция подтверждения удаления
    const ConfirmDelete = async () => {
        if (categoryToDelete) {
            const success = await deleteCategory(categoryToDelete.id);
            if (success) {
                CloseDelCategory();
            }
        }
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }


    return (
        <>
            <div className="body">
                <Naw_Admin_panel />

                <div className="AdminCategories">
                    <h1 className="adminCategories_title">Категории</h1>
                    {apiError && (
                        <div className="api-error-message">{apiError}</div>
                    )}

                    <div className="adminCategories_tools">
                        <h2 className="adminCategories_tools_title">Создание новой категории</h2>
                        <div className="adminCategories_tools_container">
                            <input type="text" className="adminCategories_tools_inp" placeholder='Название'
                                value={inp} 
                                onChange={(e) => setInp(e.target.value)}  

                                />
                            <button className="adminCategories_tools_btn" onClick={handleCreateCategory}>Создать</button>
                        </div>
                        {textError && (
                            <p className="adminCategories_tools_text">{textError}</p>
                        )}

                    </div>


                    {soslDelCategory && (
                        <div className="DelCategory_modal">
                            <div className="modal_overlay" onClick={CloseDelCategory}></div>
                            <div className="DelCategory_modal_contant">
                                <div className="filter_modal_close_container">
                                    <button className="filter_modal_close" onClick={CloseDelCategory}>✘</button>
                                </div>
                                <h3 className="DelCategory_modal_title">Подтверждение удаления</h3>
                                <p>Вы действительно хотите удалить категорию "{categoryToDelete.name}"? Это действие нельзя отменить.</p>

                                <div className="Profile_modal_buttons">
                                    <button onClick={CloseDelCategory} className="Profile_cancel_btn">
                                        Отмена
                                    </button>
                                    <button onClick={ConfirmDelete} className="Profile_delete_btn">
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="AdminCategories_content">
                        <table className='table_posts'>
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Дата создания</th>
                                    <th>Привязаные посты</th>
                                    <th> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => (
                                    <tr key={category.id}>
                                        <td>
                                            {editingId === category.id ? (
                                                <input
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    className="edit-input"
                                                />
                                            ) : (
                                                category.name
                                            )}
                                        </td>
                                        <td>{formatDate(category.created_at )}</td>
                                        <td>{category.postCount || '0'} постов</td>
                                        <td className='AdminCategories_buttons'>
                                            {editingId === category.id ? (
                                                <button className="AdminCategories_edit_btn" 
                                                onClick={() => SaveRedactor(category.id)}>сохранить</button>
                                            ) : (
                                                <button className="AdminCategories_edit_btn" 
                                                onClick={() => OpenRedactor(category)}>изменить</button>
                                            )}

                                            <button className="AdminCategories_del_btn" 
                                            onClick={() => OpenDelCategory(category)}>удалить</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}