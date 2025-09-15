import { type Dispatch, type SetStateAction, useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { type NewProductType } from '../components/types';
import { addToCartService } from '../services/addToCartService';
import { removeFromCart, addToCart } from '../utils/cartStorage';
import delay from '../utils/delay';


const useHandleCart = (setLocalCart: Dispatch<SetStateAction<NewProductType[]>>) => {
  const [ error, setError ] = useState<string | null>(null);
  const { state } = useAuthContext();
  const [ loadingButton, setLoadingButton ] = useState(false);

  const handleCart = async (item: NewProductType, isOnCart: boolean) => {
      try {
        const isLoggedIn = state.isLoggedIn;
        const userId = state?.user?._id || '';
        setLoadingButton(true);

        if (isLoggedIn) {
          const result = await addToCartService(userId, isOnCart, item._id);

          if (!result.success) {
            await delay(300);
            setLoadingButton(false);
            setError(result.message);
            return;
          }

          await delay(300);
          setLoadingButton(false);
          setLocalCart(prev => 
            isOnCart?
              prev.filter(p => p._id !== item._id) :
              [ ...prev, result.product ]
          );
          return;
        }

        await delay(300);
        setLoadingButton(false);
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
        await delay(300);
        setLoadingButton(false);
        setError((err as Error).message);
      }
  };

  return { handleCart, error, loadingButton }
}

export default useHandleCart;
