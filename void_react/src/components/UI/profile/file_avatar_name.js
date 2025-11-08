import { useState } from "react";

export const useFileName = () => {
  const [selectedFileName, setSelectedFileName] = useState("");

  const FileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    } else {
      setSelectedFileName("");
    }
  };

  return {
    FileChange,
    selectedFileName
  };
};
