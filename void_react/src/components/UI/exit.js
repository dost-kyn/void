import { useState } from "react";


export const useExit = () => {
    const[exit, setExit] = useState(false)

    const OpenExit = (exit) => {
        setExit(true)
    }
    const CloseExit = () => {
        setExit(false)
    }



    return{
        OpenExit,
        CloseExit,
        exit
    }

}
