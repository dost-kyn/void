// hooks/profile/usePhotoChange.js
import { useState } from 'react';

export const usePhotoChange = () => {
    const [photo, setPhoto] = useState(null);

    const handlePhotoChange = (file) => {
        setPhoto(file);
    };

    return {
        photo,
        setPhoto,
        handlePhotoChange
    };
};