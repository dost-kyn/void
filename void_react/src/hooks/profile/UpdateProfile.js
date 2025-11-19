import { updateUser, updateUserWithPhoto } from '../../api/users.api';

export const useUpdateProfile = (showActionAlert) => {
    const updateProfile = async (userId, userData, photo) => {
        try {       
            let result;
            const updateData = {
                name: userData.name,
                last_name: userData.last_name,
                login: userData.login,
                email: userData.email || ''
            };

            if (photo) {
                // Если есть фото, используем FormData
                const formDataObj = new FormData();
                formDataObj.append('photo', photo);

                // Добавляем текстовые поля
                Object.keys(updateData).forEach(key => {
                    if (updateData[key] !== undefined) {
                        formDataObj.append(key, updateData[key]);
                    }
                });
                result = await updateUserWithPhoto(userId, formDataObj);
            } else {
                result = await updateUser(userId, updateData);
            }

            if (result.user) {
                
                if (showActionAlert) {
                    showActionAlert('profile_updated', 'success');
                }
                
                return {
                    success: true,
                    user: result.user
                };
                
            } else if (result.message) {
                console.log('useUpdateProfile: Сервер вернул сообщение:', result.message);
                
                if (showActionAlert) {
                    showActionAlert('error_generic', 'error', { 
                        message: result.message 
                    });
                }
                return {
                    success: false,
                    error: result.message
                };
            }
        } catch (error) {
            console.error('useUpdateProfile: Ошибка обновления профиля:', error);
            
            let errorMessage = 'Ошибка при обновлении данных';
            
            if (error.message.includes('409') || error.message.includes('уже существует')) {
                errorMessage = 'Пользователь с таким логином или email уже существует';
            } else if (error.message.includes('400')) {
                errorMessage = 'Неверные данные для обновления';
            } else if (error.message.includes('401')) {
                errorMessage = 'Ошибка авторизации';
            } else if (error.message.includes('404')) {
                errorMessage = 'Пользователь не найден';
            } else {
                errorMessage = `Ошибка при обновлении данных: ${error.message}`;
            }
            
            if (showActionAlert) {
                showActionAlert('error_generic', 'error', { 
                    message: errorMessage 
                });
            }
            
            throw error;
        }
    };

    return { updateProfile };
};