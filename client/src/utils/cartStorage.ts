import type { NewProductType } from "../components/types";

const CART_KEY = 'cart';

export const getCart = (): NewProductType[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product: NewProductType): void => {
  const cart = getCart();
  if (!cart.map(prod => prod._id).includes(product._id)) {
    cart.push(product);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
};

export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(prod => prod._id !== productId);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const isInCart = (productId: string): boolean => {
  return getCart().map(prod => prod._id).includes(productId);
};
