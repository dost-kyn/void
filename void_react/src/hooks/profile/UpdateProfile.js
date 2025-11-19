
import { useState } from 'react';
import { updateUser, updateUserWithPhoto } from '../../api/users.api';

export const useUpdateProfile = (getUserIdFromToken, showActionAlert) => {
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (user, photo) => {
        setLoading(true);

        try {
            const userId = getUserIdFromToken();
            if (!userId) {
                showActionAlert('login_user_not_found', 'error');
                return false;
            }

            let result;
            const updateData = {
                name: user.name,
                last_name: user.last_name,
                login: user.login,
                email: user.email || ''
            };

            if (photo) {
                const formDataObj = new FormData();
                formDataObj.append('photo', photo);
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
                showActionAlert('profile_updated', 'success');
                return true;
            } else if (result.message) {
                showActionAlert('error_generic', 'error', { message: result.message });
                return false;
            }
        } catch (error) {
            console.error('Ошибка обновления:', error);
            showActionAlert('error_generic', 'error', { message: 'Ошибка при обновлении данных' });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handleUpdateProfile
    };
};