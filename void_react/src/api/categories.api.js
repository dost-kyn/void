const API_URL = 'http://localhost:5000/api';

export const getAllCategories = async() => {
    const response = await fetch(`${API_URL}/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
}

export const createCategory = async (categoryData) => {
    const response = await fetch(`${API_URL}/categories/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
    })
    if(!response.ok) throw new Error('Failed to create category');
    return await response.json();
}

export const updateCategory = async (id, categoryData) => {
    const response = await fetch(`${API_URL}/categories/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
    })
    if(!response.ok) throw new Error('Failed to update category');
    return await response.json();
}

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_URL}/categories/delete/${id}`, {
        method: 'DELETE'
    })
    if(!response.ok) throw new Error('Failed to delete category');
    return await response.json();
}