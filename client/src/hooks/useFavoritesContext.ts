import { FavoritesContext } from '../context/FavoritesContext';
import { useContext } from 'react';

const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('Favorites Context must be used inside a provider');
  }

  return context;
};

export default useFavoritesContext;