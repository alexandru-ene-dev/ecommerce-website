import { Link } from 'react-router-dom';
import { type NewProductType } from './types';
import { getProduct } from '../services/getProduct.ts';
import useLoadingContext from '../hooks/useLoadingContext.ts';
import delay from '../utils/delay.ts';
import useCartContext from '../hooks/useCartContext.ts';

import useFavoritesContext from '../hooks/useFavoritesContext.ts';
import useHandleFavorites from '../hooks/useHandleFavorites.ts';
import useHandleCart from '../hooks/useHandleCart.ts';
import ShoppingCartIcon from '../images/icons/shopping-cart-icon.svg?component';
import FavoriteIcon from '../images/icons/favorite-icon.svg?component';

import FavoriteFillIcon from '../images/icons/favorite-fill-icon.svg?component';
import LoadingSpinner from './LoadingSpinner.tsx';
import { type Dispatch, type SetStateAction } from 'react';
import { useAuthContext } from '../hooks/useAuthContext.ts';
import { type ActiveFeedback } from '../pages/Homepage.tsx';
import LazyProductImage from './LazyProductImage.tsx';


const NewProduct = (
  { 
    setFeedbackArray,
    setActiveFeedback,
    encodedQuery,
    item, 
  }:
  { 
    setFeedbackArray?: Dispatch<SetStateAction<ActiveFeedback[] | []>>
    setActiveFeedback?: Dispatch<SetStateAction<ActiveFeedback | null>>
    encodedQuery: string, 
    item: NewProductType
  }
) => {

  if (!item) return null;
  const { setLoading } = useLoadingContext();
  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();

  const isFavorite = localFavorites && localFavorites.some(fav => fav.id === item.id);
  const isOnCart = localCart && localCart.some(prod => prod._id === item._id);
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart, loadingButton: cartLoadingButton } = useHandleCart(setLocalCart);
  const { state } = useAuthContext();

  const newSaleForUsers = item.sale + 5;
  const newPriceForUsers = (item.oldPrice - (newSaleForUsers / 100 * item.oldPrice)).toFixed(2);


  const handleProductClick = async () => {
    setLoading(true);
    await delay(700);
    getProduct(encodedQuery);
    setLoading(false);
  };


  return (
    <div className="new-section-card">
      <div className="card-img-wrapper">
        {state.isLoggedIn && 
          <span className="join-extra-sale">Plus -5% off</span>
        }

        <button
          aria-label={`${isFavorite? 'Remove' : 'Add'} ${item.title} from favorites`} 
          onClick={async () => {
            handleFavorites(item, isFavorite).then(() => {
              if (setFeedbackArray && setActiveFeedback) {
                setActiveFeedback({ value: 'Favorites', action: isFavorite? 'remove' : 'add' });
                setFeedbackArray(prev => {
                  const newArr = [ 
                    { value: 'Favorites', action: isFavorite? 'remove' : 'add' } as ActiveFeedback,
                    ...prev
                  ];
                  return newArr; 
                });
              }
            });
            
            await delay(2000);
            if (setFeedbackArray) {
              setFeedbackArray((prev: any) => {
                return prev.slice(0, -1); 
              });
            }
          }} 
          className="add-fav-btn new-fav-btn"
        >
          <FavoriteFillIcon className={isFavorite? "favorite fill" : "favorite"} />
          <FavoriteIcon className="unfill" />
        </button>

        <Link
          aria-label={`View details for ${item.title}`} 
          to={`/${item.link}/${encodedQuery}`}
          onClick={handleProductClick}
        >   
          <div className="img-wrapper-inner">
            <LazyProductImage 
              className="new-card-img" 
              imageName={item.img} 
              alt={item.alt} 
            />
          </div>
        </Link>
      </div>

      <div className="new-card-details-wrapper">
        <Link 
          to={`/${item.link}/${encodedQuery}`}
          onClick={handleProductClick}
          className="new-card-title"
        >
          {item.title}
        </Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">
              {state.isLoggedIn? newSaleForUsers : item.sale}% off
            </span>
            <span className="limit-txt">Limited Time</span>
          </p>

          <p className="new-card-price">
            <span 
              className="old-price"
              aria-label={`Old price: ${item.oldPrice}`} 
            >
              ${item.oldPrice.toFixed(2)}
            </span>
            <span className="new-price">
              ${state.isLoggedIn? newPriceForUsers : item.price.toFixed(2)}
            </span>
          </p>
        </div>

        <div className="button-wrapper">
          <LoadingSpinner isLoading={cartLoadingButton} />

          <button 
            aria-label={`${isOnCart? 'Remove' : 'Add'} ${item.title} from cart`} 
            onClick={async () => {
              handleCart(item, isOnCart).then(() => {
                if (setActiveFeedback && setFeedbackArray) {
                  setActiveFeedback({ value: 'Cart', action: isOnCart? 'remove' : 'add' });
                  setFeedbackArray(prev => {
                    const newArr = [
                      { value: 'Cart', action: isOnCart? 'remove' : 'add' } as ActiveFeedback, 
                      ...prev 
                    ];
                    return newArr; 
                  });
                }
              });

              await delay(2000);
              if (setFeedbackArray) {
                setFeedbackArray((prev: any) => {
                  return prev.slice(0, -1); 
                });
              }
            }} 
            className="add-cart-btn new-card-btn"
          >
            <ShoppingCartIcon />
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