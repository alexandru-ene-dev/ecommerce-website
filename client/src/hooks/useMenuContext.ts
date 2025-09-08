import { useContext } from 'react';
import { MenuContext } from '../context/MenuContext/MenuContext.tsx';

export const useMenuContext = () => {
  const context = useContext(MenuContext);

  if (!context) throw new Error('MenuContext must be used inside a Provider!');
  
  return context;
}