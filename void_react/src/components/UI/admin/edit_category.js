import { useState } from "react";

export const useEditCategory = (initialText = "") => {
  const [sostEdit, setSostEdit] = useState(false); 
  const [tdText, setTdText] = useState(initialText)


  const OpenRedactor = () => {
        setSostEdit(true)
  };
  const CloseRedactor = () => {
        setSostEdit(false)
  };


  return {
    sostEdit,
    tdText,
    setTdText,
    OpenRedactor,
    CloseRedactor
  };
};