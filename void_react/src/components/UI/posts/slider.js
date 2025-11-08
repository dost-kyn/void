import { useState } from "react";

export const useSlider = (images) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // Функции для слайдера
    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    // Показываем кнопки только если изображений больше 1
    const showSliderButtons = images.length > 1;

    return {
        currentImageIndex,
        nextImage,
        prevImage,
        showSliderButtons
    }
}