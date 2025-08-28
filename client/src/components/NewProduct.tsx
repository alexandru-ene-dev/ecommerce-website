import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type NewProductType } from './types';
import type { Dispatch, SetStateAction } from 'react';
import { getProduct } from '../services/getProduct.ts';
import { saveFavoritesLocally, removeFavoriteLocally } from '../utils/localFavorites.ts';
import { FavoritesContext } from '../context/FavoritesContext.tsx';
import useLoadingContext from '../hooks/useLoadingContext.ts';
import delay from '../utils/delay.ts';
import { addToCartService } from '../services/addToCartService.ts';
import { getCart, addToCart, isInCart, removeFromCart } from '../utils/cartStorage.ts';
import useCartContext from '../hooks/useCartContext.ts';


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
  const [ error, setError ] = useState<string | null>(null);


  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a <Provider />');
  }
  const { localFavorites, setLocalFavorites } = favContext;
  const isFavorite = localFavorites.some(fav => fav.id === item.id);


  const [ isOnCart, setIsOnCart ] = useState(false);
  const { localCart, setLocalCart } = useCartContext();
  
  
  const handleFavorites = () => {
    const newFavorite = !isFavorite;

    if (newFavorite) {
      saveFavoritesLocally(item);
      setLocalFavorites(prev => {
        return [ ...prev, item ];
      });
    } else {
      removeFavoriteLocally(item.id);
      setLocalFavorites(prev => {
        const newArr = prev.filter(fav => fav.id !== item.id);
        return newArr;
      });
    }
  };


  useEffect(() => {
    setIsOnCart(isInCart(item._id));
  }, [item._id]);

  
  const handleCart = async () => {
    try {
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
      
      setIsOnCart(!isOnCart);

      // const result = await addToCartService(newCart, item._id);
  
      // if (!result.success) {
      //   console.error(result.message);
      //   return;
      // }

      // console.log(result);
    } catch (err) {
      setError((err as Error).message);
    }
  };


  return (
    <div className="new-section-card">
      <div className="card-img-wrapper">
        <button 
          onClick={handleFavorites} 
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

        <button onClick={handleCart} className="add-cart-btn new-card-btn">
          <span className="material-symbols-outlined new-cart-icon">
            shopping_cart
          </span>
          <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}

export default NewProduct;