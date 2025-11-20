// ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ ПРОФИЛЯ
const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
        const userId = getUserIdFromToken()
        if (!userId) {
            showActionAlert('error_generic', 'error', { message: 'Ошибка: пользователь не авторизован' })
            return
        }

        let result
        const updateData = {
            name: user.name,
            last_name: user.last_name,
            login: user.login,
            email: user.email || ''
        }

        if (photo) {
            // Если есть фото, используем FormData
            const formDataObj = new FormData()
            formDataObj.append('photo', photo)

            // Добавляем текстовые поля
            Object.keys(updateData).forEach(key => {
                if (updateData[key] !== undefined) {
                    formDataObj.append(key, updateData[key])
                }
            })
            result = await updateUserWithPhoto(userId, formDataObj)
        } else {
            // Если нет фото, отправляем JSON
            result = await updateUser(userId, updateData)
        }

        if (result.user) {
            // Обновляем данные в состоянии
            setUser(result.user)
            showActionAlert('profile_updated', 'success') // ПОКАЗЫВАЕМ АЛЕРТ
            CloseEditProfile() // Закрываем режим редактирования
        } else if (result.message) {
            showActionAlert('error_generic', 'error', { message: result.message })
        }
    } catch (error) {
        console.error('Ошибка обновления:', error)
        showActionAlert('error_generic', 'error', { message: 'Ошибка при обновлении данных' })
    } finally {
        setLoading(false)
        setPhoto(null)
    }
}