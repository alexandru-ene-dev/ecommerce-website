import { type NewProductType } from "../components/types";

const FAVORITE_KEY = 'favorites';

export const getLocalFavorites = (): NewProductType[] => {
  const favorites = localStorage.getItem(FAVORITE_KEY);
  return favorites? JSON.parse(favorites) : [];
};

export const saveFavoritesLocally = (product: NewProductType): void => {
  const localFavorites = getLocalFavorites();
  const exists = localFavorites.some(fav => fav.id === product.id);
  if (exists) return;

  const update = [ ...localFavorites, product ];
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(update));
};

export const removeFavoriteLocally = (productId: number): void => {
  const localFavorites = getLocalFavorites();
  const update = localFavorites.filter(product => product.id !== productId);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(update));
};

export const clearLocalFavorites = (): void => {
  localStorage.removeItem(FAVORITE_KEY);
};