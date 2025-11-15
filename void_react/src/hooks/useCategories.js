import { useState, useEffect } from "react";
import { getAllCategories } from '../api/categories.api'

export const useCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [apiError, setApiError] = useState(null)

    // загрузка категорий
    const loadCategories = async () => {
        try{
            setLoading(true)
            setApiError(null)
            const data = await getAllCategories()
            setCategories(data)
        } catch(err){
            setApiError('Ошибка при загрузке категорий')
            console.error('Error loading categories:', err)
        } finally {
            setLoading(false)
        }
    }

    // создание категории
    const handleCreateCategory = async (name) => {
        try{
            setApiError(null)
            const newCategory = await handleCreateCategory({ name })
            setCategories(prev => [...prev, newCategory])
            return true
        } catch (err){
            setApiError('Ошибка при создании категории')
            console.error('Error creating category:', err)
            return false
        }
    }

    // обновление категорий
    const handleUpdateCategory = async (id, newName) => {
        try{
            setApiError(null)
            const updatedCategory = await updateCategory(id, {name: newName})
            setCategories(prev => prev.map(cat => cat._id === id ? updatedCategory : cat))
            return true
        } catch (err){
            setApiError('Ошибка при обновлении категории')
            console.error('Error updating category:', err)
            return false
        }
    }

    // удаление категории
    const handleDeleteCategory = async (id) => {
        try{
            setApiError(null)
            await deleteCategory(id)
            setCategories(prev => prev.filter(cat => cat._id !== id))
            return true
        } catch (err){
            setApiError('Ошибка при удалении категории')
            console.error('Error deleting category:', err)
            return false
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return{
        categories,
        loading,
        setApiError,
        loadCategories,
        createCategory : handleCreateCategory,
        updateCategory : handleUpdateCategory,
        deleteCategory : handleDeleteCategory
    }
}