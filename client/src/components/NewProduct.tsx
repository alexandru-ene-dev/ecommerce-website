import { Link } from 'react-router-dom';
import { type NewProductType } from './types';
import { getProduct } from '../services/getProduct.ts';
import useLoadingContext from '../hooks/useLoadingContext.ts';

import delay from '../utils/delay.ts';
import useCartContext from '../hooks/useCartContext.ts';
import useFavoritesContext from '../hooks/useFavoritesContext.ts';
import useHandleFavorites from '../hooks/useHandleFavorites.ts';

import useHandleCart from '../hooks/useHandleCart.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.ts';


const NewProduct = (
  { 
    imgSrc,
    encodedQuery,
    item, 
  }:
  { 
    imgSrc: string, 
    encodedQuery: string, 
    item: NewProductType
  }
) => {

  if (!item) return null;
  const { setLoading } = useLoadingContext();
  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const [ buttonLoading, setButtonLoading ] = useState(false);

  const isFavorite = localFavorites && localFavorites.some(fav => fav.id === item.id);
  const isOnCart = localCart && localCart.some(prod => prod._id === item._id);
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart } = useHandleCart(setLocalCart);
  const { state } = useAuthContext();

  const newSaleForUsers = item.sale + 5;
  const newPriceForUsers = (item.oldPrice - (newSaleForUsers / 100 * item.oldPrice)).toFixed(2);


  return (
    <div className="new-section-card">
      <div className="card-img-wrapper">
        {state.isLoggedIn && 
          <span className="join-extra-sale">Plus -5% off</span>
        }

        <button 
          onClick={() => handleFavorites(item, isFavorite)} 
          className="add-fav-btn new-fav-btn">
          <span 
            data-favorite={isFavorite? "true" : "false"}
            className="material-symbols-outlined new-fav-icon"
          >
            favorite
          </span>
        </button>

        <Link 
          to={`/${item.link}/${encodedQuery}`}
          onClick={async () => {
            setLoading(true);
            await delay(700);
            getProduct(encodedQuery);
            setLoading(false);
          }}
        >   
          <div className="img-wrapper-inner">
            <img className="new-card-img" src={imgSrc} alt={item.alt} />
          </div>
        </Link>
      </div>

      <div className="new-card-details-wrapper">
        <Link 
          to={`/${item.link}/${encodedQuery}`}
          onClick={async () => {
            setLoading(true);
            await delay(700);
            getProduct(encodedQuery);
            setLoading(false);
          }}
          className="new-card-title">{item.title}</Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">
              {state.isLoggedIn? newSaleForUsers : item.sale}% off
            </span>
            <span className="limit-txt">Limited Time</span>
          </p>
          <p className="new-card-price">
            <span className="old-price">${item.oldPrice.toFixed(2)}</span>
            <span className="new-price">
              ${state.isLoggedIn? newPriceForUsers : item.price.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="button-wrapper">
          <LoadingSpinner isLoading={buttonLoading} />

          <button 
            onClick={async () => {
              setButtonLoading(true);
              handleCart(item, isOnCart);
              await delay(700);
              setButtonLoading(false);
            }} 
            className="add-cart-btn new-card-btn"
          >
            <span className="material-symbols-outlined new-cart-icon">
              shopping_cart
            </span>
            <span>
              {isOnCart? 'Remove from Cart' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewProduct;