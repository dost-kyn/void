import { useState, useRef, useEffect } from 'react';

export const useReadMore = (maxHeight = 400) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const isOverflowing = contentRef.current.scrollHeight > maxHeight;
      setIsOverflowed(isOverflowing);
    }
  }, [maxHeight]);

  const toggleExpand = () => {
    if (!isExpanded && contentRef.current) {
      // При раскрытии - просто меняем состояние
      setIsExpanded(true);
    } else {
      // При скрытии - прокручиваем вверх и меняем состояние
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      setIsExpanded(false);
    }
  };

  return {
    contentRef,
    isOverflowed,
    isExpanded,
    toggleExpand
  };
};