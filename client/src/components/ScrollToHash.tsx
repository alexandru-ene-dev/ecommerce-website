import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // timeout to wait for the DOM to mount
      const scrollToElement = () => {
        const el = document.getElementById(location.hash.substring(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };

      // Try immediately, then again after short delay
      scrollToElement();
      const timeoutId = setTimeout(scrollToElement, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [location]);
  
  return null;
};

export default ScrollToHash;
