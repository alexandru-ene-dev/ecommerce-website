import useCartContext from "../hooks/useCartContext";
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import type { NewProductType } from "./types";
import useFavoritesContext from "../hooks/useFavoritesContext";
import { useNavigate } from "react-router-dom";
import { type ActiveFeedback } from "../pages/Homepage";
import delay from "../utils/delay";

import useHandleCart from "../hooks/useHandleCart";
import useHandleFavorites from "../hooks/useHandleFavorites";
import { Link } from 'react-router-dom';
import QuantitySelector from "./QuantitySelector";
import LoadingSpinner from "./LoadingSpinner";
import { useAuthContext } from "../hooks/useAuthContext";


type CartItemProps = {
  setFeedbackArray: Dispatch<SetStateAction<ActiveFeedback[] | []>>,
  setActiveFeedback: Dispatch<SetStateAction<ActiveFeedback | null>>,
  prod: NewProductType
};


const CartItem = (
  { 
    prod,
    setFeedbackArray,
    setActiveFeedback
  }: CartItemProps
) => {

  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext(); 
  const [ quantity, setQuantity ] = useState(1);
  const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
  const slug = prod.title.replace(' ', '-');

  const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
  const isInCart = localCart && localCart.some(p => p._id === prod._id);
  const navigate = useNavigate();
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart, loadingButton } = useHandleCart(setLocalCart);

  const newSaleForUsers = prod.sale + 5;
  const newPriceForUsers = (prod.oldPrice - (newSaleForUsers / 100 * prod.oldPrice)).toFixed(2);
  const { state } = useAuthContext();


  useEffect(() => {
    setQuantity(prod.quantity || 1);
  }, [prod.quantity, prod]);


  const updateQuantity = (newQty: number) => {
    setQuantity(newQty);

    setLocalCart(prev => {
      const updatedCart = prev.map(item =>
        item._id === prod._id ? { ...item, quantity: newQty } : item
      );

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };


  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateQuantity(newQty);
  };


  const handleDecrease = () => {
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    updateQuantity(newQty);
  };


  return (
    <div key={prod._id} className="cart-product">
      {loadingButton && <LoadingSpinner isLoading={loadingButton} />}

      <div
        onClick={() => navigate(`/products/${slug}`)} 
        className="cart-img-wrapper"
      >
        <button 
          onClick={async (e) => {
            e.stopPropagation();
            handleFavorites(prod, isFavorite).then(() => {
              setActiveFeedback({ value: 'Favorites', action: isFavorite? 'remove' : 'add' });
              setFeedbackArray(prev => {
                const newArr = [ 
                  { value: 'Favorites', action: isFavorite? 'remove' : 'add' } as ActiveFeedback,
                  ...prev
                ];
                return newArr; 
              });
            });
            
            await delay(2000);
            setFeedbackArray((prev: any) => {
              return prev.slice(0, -1); 
            });
          }} 
          className="add-fav-btn new-fav-btn">
          <span 
            data-favorite={isFavorite? "true" : "false"}
            className="material-symbols-outlined new-fav-icon"
          >
            favorite
          </span>
        </button>

        <img className="cart-img" src={imgSrc} alt={prod.alt} />
      </div>

      <div className="price-cart-wrap">
        <Link className="cart-product_link" to={`/products/${slug}`}>
          <p className="cart-product_title new-card-title">{prod.title}</p>
        </Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">
              {state.isLoggedIn? newSaleForUsers : prod.sale }% off
            </span>
            <span className="limit-txt">Limited Time</span>
          </p>

          <p className="new-card-price">
            <span className="old-price">
              ${(prod.oldPrice * (prod.quantity || 1)).toFixed(2)}
            </span>

            <span className="new-price">
              ${state.isLoggedIn ? 
                ((Number(newPriceForUsers) * (prod.quantity || 1))).toFixed(2) : 
                ((prod.price * (prod.quantity || 1))).toFixed(2)
              }
            </span>
          </p>
        </div>

        <div className="quantity-flex">
          <QuantitySelector 
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />

          <div>
            <button
              className="new-card-btn cart-item-btn"
              onClick={async () => {
                handleCart(prod, isInCart).then(() => {
                  setActiveFeedback({ value: 'Cart', action: isInCart? 'remove' : 'add' });
                  setFeedbackArray(prev => {
                    const newArr = [
                      { value: 'Cart', action: isInCart? 'remove' : 'add' } as ActiveFeedback, 
                      ...prev 
                    ];
                    return newArr; 
                  });
                });

                await delay(2000);
                setFeedbackArray((prev: any) => {
                  return prev.slice(0, -1); 
                });
              }}
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
