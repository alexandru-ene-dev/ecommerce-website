import { useState, type Dispatch, type SetStateAction } from 'react';
import { addToFavorites } from '../services/addToFavorites';
import { saveFavoritesLocally, removeFavoriteLocally } from '../utils/localFavorites';
import { useAuthContext } from './useAuthContext';
import type { NewProductType } from '../components/types';


const useHandleFavorites = (setLocalFavorites: Dispatch<SetStateAction<NewProductType[]>>) => {
  const [ error, setError ] = useState<string | null>(null);
  const { state } = useAuthContext();

  const handleFavorites = async (item: NewProductType, isFavorite: boolean) => {
    try {
      const isLoggedIn = state.isLoggedIn;
      const userId = state?.user?._id || '';

      if (isLoggedIn) {
        const result = await addToFavorites(userId, isFavorite, item._id);

        if (!result.success) {
          console.error(result.message);
          return;
        }

        setLocalFavorites(prev =>
          isFavorite
            ? prev.filter(p => p._id !== item._id)
            : [...prev, result.product]
        );
        console.log(result, 'Favorites updated');

      } else {
        if (isFavorite) {
          removeFavoriteLocally(item.id);
          setLocalFavorites(prev => prev.filter(fav => fav.id !== item.id));
        } else {
          saveFavoritesLocally(item);
          setLocalFavorites(prev => [...prev, item]);
        }
      }
      
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return { handleFavorites, error };
};

export default useHandleFavorites;
