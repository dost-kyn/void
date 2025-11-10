import { useState, useRef } from 'react';

export const useAutoResizeTextarea = () => {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }
  };

  const resetHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '45px';
    }
  };

  return { textareaRef, adjustHeight, resetHeight };
};