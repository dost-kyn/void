import { useState } from "react";




export const useCreate = () => {
    const[sostCreate, setSostCreate] = useState(false)

    const OpenCreate = (sostCreate) => {
        setSostCreate(true)
    }

    const CloseCreate = () =>{
        setSostCreate(false)
    }

    return{
        sostCreate, OpenCreate, CloseCreate
    }
}