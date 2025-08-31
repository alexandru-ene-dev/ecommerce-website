import { Link } from 'react-router-dom';
import { type NewProductType } from './types';
import type { Dispatch, SetStateAction } from 'react';
import { getProduct } from '../services/getProduct.ts';
import useLoadingContext from '../hooks/useLoadingContext.ts';

import delay from '../utils/delay.ts';
import useCartContext from '../hooks/useCartContext.ts';
import useFavoritesContext from '../hooks/useFavoritesContext.ts';
import useHandleFavorites from '../hooks/useHandleFavorites.ts';
import useHandleCart from '../hooks/useHandleCart.ts';


const NewProduct = (
  { 
    imgSrc,
    encodedQuery,
    item, 
    setIsBtnVisible 
  }:
  { 
    imgSrc: any, 
    encodedQuery: any, 
    item: NewProductType
    setIsBtnVisible: Dispatch<SetStateAction<boolean>>
  }
) => {

  if (!item) return null;
  const { setLoading } = useLoadingContext();
  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const isFavorite = localFavorites && localFavorites.some(fav => fav.id === item.id);

  const isOnCart = localCart && localCart.some(prod => prod._id === item._id);
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart } = useHandleCart(setLocalCart);


  // const handleFavorites = async () => {
  //   try {
  //     const isLoggedIn = state.isLoggedIn;
  //     const userId = state?.user?._id || '';

  //     if (isLoggedIn) {
  //       const result = await addToFavorites(userId, isFavorite, item._id);

  //       if (!result.success) {
  //         console.error(result.message);
  //         return;
  //       }

  //        // Update favorites
  //       setLocalFavorites(prev => {
  //         if (isFavorite) {
  //           // Item was favorite, so we remove it
  //           return prev.filter(p => p._id !== item._id);
  //         } else {
  //           // Item was not favorite so we add it
  //           return [ ...prev, result.product ];
  //         }
  //       });

  //       console.log(result, 'Favorites updated');
  //       return;
  //     }

  //     if (isFavorite) {
  //       removeFavoriteLocally(item.id);
  //       setLocalFavorites(prev => {
  //         const newArr = prev.filter(fav => fav.id !== item.id);
  //         return newArr;
  //       });

  //     } else {
  //       saveFavoritesLocally(item);
  //       setLocalFavorites(prev => {
  //         return [ ...prev, item ];
  //       });
  //     }

  //   } catch (err) {
  //     setError((err as Error).message);
  //   }
  // };

  
  // const handleCart = async () => {
  //   try {
  //     const isLoggedIn = state.isLoggedIn;
  //     const userId = state?.user?._id || '';

  //     if (isLoggedIn) {
  //       const result = await addToCartService(userId, isOnCart, item._id);

  //       if (!result.success) {
  //         console.error(result.message);
  //         return;
  //       }

  //       setLocalCart(prev => {
  //         if (isOnCart) {
  //           return prev.filter(p => p._id !== item._id);
  //         } else {
  //           return [ ...prev, result.product ];
  //         }
  //       });

  //       console.log(result, 'Cart updated');
  //       return;
  //     }

  //     if (isOnCart) {
  //       removeFromCart(item._id);
  //       setLocalCart(prev => {
  //         const newLocalCart = prev.filter(p => p._id !== item._id);
  //         return newLocalCart;
  //       });
  //     } else {
  //       addToCart(item);
  //       setLocalCart(prev => {
  //         const newLocalCart = [ ...prev, item ];
  //         return newLocalCart;
  //       });
  //     }
      
  //   } catch (err) {
  //     setError((err as Error).message);
  //   }
  // };


  return (
    <div className="new-section-card">
      <div className="card-img-wrapper">
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

        <div className="img-wrapper-inner">
          <Link 
            to={`/${item.link}/${encodedQuery}`}
            onClick={async () => {
              setLoading(true);
              setIsBtnVisible(true);
              await delay(700);
              getProduct(encodedQuery);
              setLoading(false);
            }}
            className="card-img-link"
          >
            <img className="new-card-img" src={imgSrc} alt={item.alt} />
          </Link>
        </div>
      </div>

      <div className="new-card-details-wrapper">
        <Link 
          to={`/${item.link}/${encodedQuery}`}
          onClick={async () => {
            setIsBtnVisible(true);
            setLoading(true);
            await delay(700);
            getProduct(encodedQuery);
            setLoading(false);
          }}
          className="new-card-title">{item.title}</Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">{item.sale}% off</span>
            <span className="limit-txt">Limited Time</span>
          </p>
          <p className="new-card-price">
            <span className="old-price">${item.oldPrice}</span>
            <span className="new-price">${item.price}</span>
          </p>
        </div>

        <button onClick={() => handleCart(item, isOnCart)} className="add-cart-btn new-card-btn">
          <span className="material-symbols-outlined new-cart-icon">
            shopping_cart
          </span>
          <span>
            {isOnCart? 'Remove from Cart' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  );
}

export default NewProduct;