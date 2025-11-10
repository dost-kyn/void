import { useState } from "react";

export const useCreateCategory = () => {
  const [inp, setInp] = useState(""); 
  const [textError, setTextError] = useState(false)


  const CreareCategory = () => {
    if (inp.trim() === "") {
        setTextError(true)
    } else {
        setTextError(false)
        setInp("");
    }
  };


  return {
    inp, setInp, CreareCategory, textError 
  };
};
