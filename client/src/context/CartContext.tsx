import { 
  type Dispatch, createContext, type ReactNode, 
  type SetStateAction, useState, useMemo, useEffect
} from "react";
import type { NewProductType } from "../components/types";
import { getCart } from "../utils/cartStorage";


type CartContextType = {
  localCart: NewProductType[],
  setLocalCart: Dispatch<SetStateAction<NewProductType[]>>
};


export const CartContext = createContext<CartContextType | null>(null);


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [ localCart, setLocalCart ] = useState<NewProductType[]>([]);

  useEffect(() => {
    const cart = getCart();
    setLocalCart(cart);
  }, []);

  const value = useMemo(() => ({ localCart, setLocalCart }), [localCart]);
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};