import { useState } from "react";
import { useCategories } from "../../../hooks/useCategories"; // Импортируем хук категорий

export const useFilter = () => {
    const [sostFilter, setSostFilter] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Получаем категории из базы
    const {
        categories,
        loading: categoriesLoading,
        apiError: categoriesError
    } = useCategories();

    const OpenFilter = () => {
        setSostFilter(true);
    }

    const CloseFilter = () => {
        setSostFilter(false);
    }

    // Обработчик выбора категории
    const handleCategorySelect = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    }

    // Очистка фильтра
    const clearFilter = () => {
        setSelectedCategories([]);
    }
        // ✅ Обработчик с ограничением на 3 категории
    const RegCategorySelect = (categoryId) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                // Убираем категорию если уже выбрана
                return prev.filter(id => id !== categoryId);
            } else {
                // Проверяем что не больше 3 категорий
                if (prev.length >= 3) {
                    alert('Можно выбрать максимум 3 категории');
                    return prev;
                }
                // Добавляем категорию
                return [...prev, categoryId];
            }
        });
    }

    // Применить фильтр
    const applyFilter = () => {
        console.log('Выбранные категории:', selectedCategories);
        // Здесь можно добавить логику фильтрации постов
        CloseFilter();
        return selectedCategories; // Возвращаем выбранные категории
    }

    

    return {
        sostFilter, 
        OpenFilter, 
        CloseFilter,

        // Данные категорий
        categories,
        categoriesLoading,
        categoriesError,

        // Функции фильтра
        selectedCategories,
        handleCategorySelect,
        clearFilter,
        applyFilter
    }
}