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
    setIsExpanded(!isExpanded);
  };

  return {
    contentRef,
    isOverflowed,
    isExpanded,
    toggleExpand
  };
};