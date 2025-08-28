import { CartContext } from "../context/CartContext";
import { useContext } from 'react';

const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('CartContext must be used inside a provider');
  }

  return context;
};

export default useCartContext;