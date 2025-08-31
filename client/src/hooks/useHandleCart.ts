import { type Dispatch, type SetStateAction, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { type NewProductType } from '../components/types';
import { addToCartService } from '../services/addToCartService';
import { removeFromCart, addToCart } from '../utils/cartStorage';


const useHandleCart = (setLocalCart: Dispatch<SetStateAction<NewProductType[]>>) => {
  const [ error, setError ] = useState<string | null>(null);
  const { state } = useAuthContext();

  const handleCart = async (item: NewProductType, isOnCart: boolean) => {
      try {
        const isLoggedIn = state.isLoggedIn;
        const userId = state?.user?._id || '';

        if (isLoggedIn) {
          const result = await addToCartService(userId, isOnCart, item._id);

          if (!result.success) {
            console.error(result.message);
            return;
          }

          setLocalCart(prev => 
            isOnCart?
              prev.filter(p => p._id !== item._id) :
              [ ...prev, result.product ]
          );

          console.log(result, 'Cart updated');
          return;
        }

        if (isOnCart) {
          removeFromCart(item._id);
          setLocalCart(prev => {
            const newLocalCart = prev.filter(p => p._id !== item._id);
            return newLocalCart;
          });
        } else {
          addToCart(item);
          setLocalCart(prev => {
            const newLocalCart = [ ...prev, item ];
            return newLocalCart;
          });
        }
        
      } catch (err) {
        setError((err as Error).message);
      }
  };

  return { handleCart, error }
}

export default useHandleCart;
