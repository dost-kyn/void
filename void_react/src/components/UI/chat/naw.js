import { useState, useEffect } from 'react';

export const useNaw = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 481);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};