import { useState } from "react";


export const useDelCategory = () => {
    const[soslDelCategory, setSoslDelCategory] = useState(false)

    const OpenDelCategory = (soslDelCategory) => {
        setSoslDelCategory(true)
    }
    const CloseDelCategory = () => {
        setSoslDelCategory(false)
    }



    return{
        soslDelCategory, OpenDelCategory, CloseDelCategory

    }

}