import type { NewProductType } from "../components/types";


export const getRecentlyViewed = (limit: number) => {
  const limited = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').slice(0, limit);
  return limited;
};


export const addToRecentlyViewed = (product: NewProductType, limit: number = 10) => {
  if (!product?._id) return;

  const stored = getRecentlyViewed(10);
  const withoutDuplicate = stored.filter((p: NewProductType) => p._id !== product._id);
  const updated = [product, ...withoutDuplicate].slice(0, limit);
  localStorage.setItem('recentlyViewed', JSON.stringify(updated));
};
