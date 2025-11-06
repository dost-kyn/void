import { useState } from "react";


export const useFilter = () => {
    const [sostFilter, setSostFilter] = useState(false)

    const OpenFilter = (sostFilter) =>{
        setSostFilter(true)
    }

    const CloseFilter = () =>{
        setSostFilter(false)
    }

    return{
        sostFilter, OpenFilter, CloseFilter
    }
}