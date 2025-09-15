import { useState, type Dispatch, type SetStateAction } from 'react';
import { addToFavorites } from '../services/addToFavorites';
import { saveFavoritesLocally, removeFavoriteLocally } from '../utils/localFavorites';
import { useAuthContext } from './useAuthContext';
import type { NewProductType } from '../components/types';
import delay from '../utils/delay';


const useHandleFavorites = (setLocalFavorites: Dispatch<SetStateAction<NewProductType[]>>) => {
  const [ error, setError ] = useState<string | null>(null);
  const { state } = useAuthContext();
  const [ loadingButton, setLoadingButton ] = useState(false);

  const handleFavorites = async (item: NewProductType, isFavorite: boolean) => {
    try {
      const isLoggedIn = state.isLoggedIn;
      const userId = state?.user?._id || '';
      setLoadingButton(true);

      if (isLoggedIn) {
        const result = await addToFavorites(userId, isFavorite, item._id);

        if (!result.success) {
          await delay(300);
          setLoadingButton(false);
          setError(result.message);
          return;
        }

        await delay(300);
        setLoadingButton(false);
        setLocalFavorites(prev =>
          isFavorite
            ? prev.filter(p => p._id !== item._id)
            : [...prev, result.product]
        );

      } else {
        await delay(300);
        setLoadingButton(false);
        if (isFavorite) {
          removeFavoriteLocally(item.id);
          setLocalFavorites(prev => prev.filter(fav => fav.id !== item.id));
        } else {
          saveFavoritesLocally(item);
          setLocalFavorites(prev => [...prev, item]);
        }
      }
      
    } catch (err) {
      await delay(300);
      setLoadingButton(false);
      setError((err as Error).message);
    }
  };

  return { handleFavorites, error, loadingButton };
};

export default useHandleFavorites;
