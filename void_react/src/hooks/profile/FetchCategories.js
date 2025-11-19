// hooks/useFetchCategories.js
import { useState } from 'react';
import { getAllCategories } from '../../api/categories.api';

export const useFetchCategories = (showActionAlert) => {
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const categoriesData = await getAllCategories();
            setCategories(categoriesData);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
            showActionAlert('error_generic', 'error', { message: 'Ошибка загрузки категорий' });
        }
    };

    return {
        categories,
        setCategories,
        fetchCategories
    };
};