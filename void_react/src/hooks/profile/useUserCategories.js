// hooks/profile/useUserCategories.js
import { useState, useEffect } from 'react';
import { getUserCategories, updateUserCategories } from '../../api/users.api';
import { getAllCategories } from '../../api/categories.api';

export const useUserCategories = (userId) => {
    const [categories, setCategories] = useState([]);
    const [userCategories, setUserCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузка всех категорий и категорий пользователя
    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            // console.log('🔄 Загружаем все категории...');
            // Загружаем все доступные категории
            const allCategories = await getAllCategories();
            setCategories(allCategories);
            // console.log('✅ Все категории загружены:', allCategories);

            // Загружаем категории пользователя
            if (userId) {
                // console.log('🔄 Загружаем категории пользователя ID:', userId);
                const userCats = await getUserCategories(userId);
                setUserCategories(userCats);
                
                // Устанавливаем выбранные категории
                const selectedIds = userCats.map(cat => cat.id);
                setSelectedCategories(selectedIds);
                // console.log('✅ Категории пользователя загружены:', userCats);
            }

        } catch (err) {
            console.error('❌ Error loading categories:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Обработчик выбора/снятия категории
    const handleCategorySelect = (categoryId) => {
        setSelectedCategories(prev => {
            const isSelected = prev.includes(categoryId);
            
            if (isSelected) {
                // Убираем категорию
                return prev.filter(id => id !== categoryId);
            } else {
                // Добавляем категорию, если не превышен лимит
                if (prev.length < 3) {
                    return [...prev, categoryId];
                }
                return prev;
            }
        });
    };

    // Сохранение категорий
    const saveCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            // console.log('💾 Сохраняем категории:', selectedCategories);
            await updateUserCategories(userId, selectedCategories);
            
            // Обновляем локальные данные
            const updatedUserCats = categories.filter(cat => 
                selectedCategories.includes(cat.id)
            );
            setUserCategories(updatedUserCats);

            // console.log('✅ Категории успешно сохранены');
            return true;
        } catch (err) {
            console.error('❌ Error saving categories:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Сброс к исходным категориям пользователя
    const resetCategories = () => {
        const originalIds = userCategories.map(cat => cat.id);
        setSelectedCategories(originalIds);
        // console.log('🔄 Категории сброшены к исходным:', originalIds);
    };

    // Загружаем категории при монтировании или изменении userId
    useEffect(() => {
        if (userId) {
            loadCategories();
        }
    }, [userId]);

    return {
        categories,
        userCategories,
        selectedCategories,
        loading,
        error,
        handleCategorySelect,
        saveCategories,
        resetCategories,
        loadCategories
    };
};