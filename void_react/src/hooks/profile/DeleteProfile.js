
import { delProfile } from '../../api/users.api';

export const useDeleteProfile = (showActionAlert) => {
    const deleteProfile = async (userId) => {

        try {
            const result = await delProfile(userId);
            localStorage.removeItem('token');
            localStorage.removeItem('user'); 

            if (showActionAlert) {
                showActionAlert('success_generic', 'success', { 
                    message: 'Профиль успешно удален' 
                });
            }
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
            
        } catch (error) {
            console.error('useDeleteProfile: Ошибка удаления профиля:', error);
            let alertAction = 'error_generic';
            let alertData = { message: 'Ошибка удаления профиля' };
            
            if (error.message.includes('403')) {
                alertAction = 'error_generic';
                alertData = { message: 'Нельзя удалить чужой профиль' };
            }  else if (error.message.includes('404')) {
                alertAction = 'error_generic';
                alertData = { message: 'Пользователь не найден' };
            } else {
                alertData = { message: `Ошибка удаления профиля: ${error.message}` };
            }
            
            if (showActionAlert) {
                showActionAlert(alertAction, 'error', alertData);
            }
            
            throw error;
        }
    };

    return { deleteProfile };
};