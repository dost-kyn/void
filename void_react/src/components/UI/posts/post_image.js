import { useState } from "react";


export const useImage = () =>{
    const [selectedImage, setSelectedImage] = useState(null);

    const OpenModal = (imageSrc) =>{
        setSelectedImage(imageSrc)
    }
    const CloseModal = () =>{
        setSelectedImage(null)
    }


    return{
        OpenModal,
        CloseModal,
        selectedImage
    }
}