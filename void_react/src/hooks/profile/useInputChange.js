// hooks/profile/useInputChange.js
export const useInputChange = (setUser) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return { handleInputChange };
};