import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
};
