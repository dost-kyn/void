import React from 'react'
import '../../css/Admin_panel.css'
import { useState } from 'react';


import Naw_Admin_panel from '../../components/Naw_Admin_panel'
import { useDelCategory } from '../../components/UI/admin/delete_category'
import { useCreateCategory } from '../../components/UI/admin/create_category'
import { useEditCategory } from '../../components/UI/admin/edit_category'

export default function AdminCategories() {
     const categories = ["Котята", "Собаки", "Птицы", "Рыбки"];
    const { soslDelCategory, OpenDelCategory, CloseDelCategory } = useDelCategory(false)
    const { inp, setInp, CreareCategory, textError } = useCreateCategory('')
    const { sostEdit, tdtext, setTdText, OpenRedactor, CloseRedactor } = useEditCategory();

    return (
        <>
            <div className="body">
                <Naw_Admin_panel />

                <div className="AdminCategories">
                    <h1 className="adminCategories_title">Категории</h1>

                    <div className="adminCategories_tools">
                        <h2 className="adminCategories_tools_title">Создание новой категории</h2>
                        <div className="adminCategories_tools_container">
                            <input type="text" className="adminCategories_tools_inp" placeholder='Название'
                                value={inp} onChange={(e) => setInp(e.target.value)} />
                            <button className="adminCategories_tools_btn" onClick={CreareCategory}>Создать</button>
                        </div>
                        {textError && (
                            <p className="adminCategories_tools_text">Категорию нельзя создать - поле пустое</p>
                        )}

                    </div>


                    {soslDelCategory && (
                        <div className="DelCategory_modal">
                            <div className="modal_overlay"></div>
                            <div className="DelCategory_modal_contant">
                                <div className="filter_modal_close_container">
                                    <button className="filter_modal_close" onClick={CloseDelCategory}>✘</button>
                                </div>
                                <h3 className="DelCategory_modal_title">Подтверждение удаления</h3>
                                <p>Вы действительно хотите удалить категорию? Это действие нельзя отменить.</p>

                                <div className="Profile_modal_buttons">
                                    <button onClick={CloseDelCategory} className="Profile_cancel_btn">
                                        Отмена
                                    </button>
                                    <button className="Profile_delete_btn">
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

                                <tr>
                                    <td>
                                        {sostEdit ? (
                                            <input
                                                value={tdtext}
                                                onChange={(e) => setTdText(e.target.value)}
                                            />
                                        ) : (
                                            tdtext
                                        )}
                                    </td>
                                    <td>01.05.25</td>
                                    <td>456 поста</td>
                                    <td className='AdminCategories_buttons'>
                                        {sostEdit ? (
                                            <button className="AdminCategories_edit_btn" onClick={CloseRedactor}>сохранить</button>
                                        ) : (
                                            <button className="AdminCategories_edit_btn" onClick={OpenRedactor}>изменить</button>
                                        )}

                                        <button className="AdminCategories_del_btn" onClick={OpenDelCategory}>удалить</button>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}