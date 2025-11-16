import { useState, useEffect } from "react";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../api/categories.api'


export const loadCategories = async (setLoading, setApiError, setCategories) => {
    try {
        setLoading(true)
        setApiError(null)
        const data = await getAllCategories()
        setCategories(data)
    } catch (err) {
        setApiError('Ошибка при загрузке категорий')
        console.error('Error loading categories:', err)
    } finally {
        setLoading(false)
    }
}

export const handleCreateCategory = async (name, setApiError, setCategories) => {
    try{
        setApiError(null)
        const newCategory = await createCategory({ name })
        setCategories(prev => [...prev, newCategory])
        return true
    } catch (err){
        setApiError('Ошибка при создании категории')
        console.error('Error creating category:', err)
        return false
    }
}

export const handleUpdateCategory = async (id, newName, setApiError, setCategories) => {
    try {
        setApiError(null)
        const updatedCategory = await updateCategory(id, { name: newName });
        setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
        return true
    } catch (err) {
        setApiError('Ошибка при обновлении категории')
        console.error('Error updating category:', err)
        return false
    }
}

export const handleDeleteCategory = async (id, setApiError, setCategories) => {
    try {
        setApiError(null)
        await deleteCategory(id)
        setCategories(prev => prev.filter(cat => cat.id !== id))
        return true
    } catch (err) {
        setApiError('Ошибка при удалении категории')
        console.error('Error deleting category:', err)
        return false
    }
}


export const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(null)

    useEffect(() => {
        loadCategories(setLoading, setApiError, setCategories)
    }, [])

    return {
        categories,
        loading,
        apiError,
        setApiError,
        loadCategories: () => loadCategories(setLoading, setApiError, setCategories),
        createCategory: (name) => handleCreateCategory(name, setApiError, setCategories),
        updateCategory: (id, newName) => handleUpdateCategory(id, newName, setApiError, setCategories),
        deleteCategory: (id) => handleDeleteCategory(id, setApiError, setCategories)
    }
}

