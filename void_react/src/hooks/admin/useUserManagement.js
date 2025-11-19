
import { useState } from 'react';
import { banUser, unbanUser } from '../../api/users.api';

export const useUserManagement = (showActionAlert) => {
    const [loading, setLoading] = useState(false);

    const handleBanUser = async (userId, userName) => {
        try {
            setLoading(true);
            console.log(`🔨 Бан пользователя ID: ${userId}`);
            
            await banUser(userId);
            
            if (showActionAlert) {
                showActionAlert('user_banned', 'success', { userName });
            }
            
            return true;
        } catch (error) {
            console.error('❌ Ошибка при бане пользователя:', error);
            
            if (showActionAlert) {
                showActionAlert('error_generic', 'error', { 
                    message: `Ошибка при бане пользователя: ${error.message}` 
                });
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUnbanUser = async (userId, userName) => {
        try {
            setLoading(true);
            console.log(`🔓 Разбан пользователя ID: ${userId}`);
            
            await unbanUser(userId);
            
            if (showActionAlert) {
                showActionAlert('user_unbanned', 'success', { userName });
            }
            
            return true;
        } catch (error) {
            console.error('❌ Ошибка при разбане пользователя:', error);
            
            if (showActionAlert) {
                showActionAlert('error_generic', 'error', { 
                    message: `Ошибка при разбане пользователя: ${error.message}` 
                });
            }
            
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleBanUser,
        handleUnbanUser
    };
};