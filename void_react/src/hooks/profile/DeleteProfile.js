
import { delProfile } from '../../api/users.api';

export const useDeleteProfile = (showActionAlert) => {
    const deleteProfile = async (userId) => {
        console.log('🗑️ useDeleteProfile: Начинаем удаление профиля userId:', userId);
        try {
            const result = await delProfile(userId);
            console.log('✅ useDeleteProfile: Профиль удален:', result);
            
            // Успешное удаление
            localStorage.removeItem('token');
            console.log('🔓 useDeleteProfile: Токен удален из localStorage');
            
            if (showActionAlert) {
                showActionAlert('success_generic', 'success', { message: 'Профиль успешно удален' });
            }
            
            setTimeout(() => {
                console.log('🔄 useDeleteProfile: Перенаправляем на главную страницу');
                window.location.href = '/';
            }, 1500);
            
        } catch (error) {
            console.error('❌ useDeleteProfile: Ошибка удаления профиля:', error);
            
            // НЕ удаляем токен при ошибке!
            console.log('⚠️ useDeleteProfile: Токен НЕ удален из-за ошибки');
            
            if (showActionAlert) {
                showActionAlert('error_generic', 'error', { message: 'Ошибка удаления профиля: ' + error.message });
            }
            
            // Пробрасываем ошибку дальше, чтобы компонент знал об ошибке
            throw error;
        }
    };

    return { deleteProfile };
};