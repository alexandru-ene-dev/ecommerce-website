import { type NewProductType } from "./types";
import { Link } from 'react-router-dom';
import useLoadingContext from "../hooks/useLoadingContext";
import delay from "../utils/delay";
import useCartContext from "../hooks/useCartContext";

import useFavoritesContext from "../hooks/useFavoritesContext";
import useHandleCart from "../hooks/useHandleCart";
import useHandleFavorites from "../hooks/useHandleFavorites";
import LoadingSpinner from "./LoadingSpinner";
import type { Dispatch, SetStateAction } from "react";

import type { ActiveFeedback } from "../pages/Homepage";
import { useAuthContext } from "../hooks/useAuthContext";
import RemoveFromCartIcon from '../images/icons/remove-shopping-cart-icon.svg?component';
import AddToCartIcon from '../images/icons/add-shopping-cart-icon.svg?component';
import CloseIcon from '../images/icons/close-icon.svg?component';
import LazyProductImage from "./LazyProductImage";


type FavType = {
  setFeedbackArray: Dispatch<SetStateAction<ActiveFeedback[] | []>>,
  setActiveFeedback: Dispatch<SetStateAction<ActiveFeedback | null>>,
  fav: NewProductType
}


const FavoriteItem = (
  {
    fav,  
    setFeedbackArray, 
    setActiveFeedback 
  }: FavType
) => {
  const { setLoading } = useLoadingContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  
  const { handleCart, loadingButton } = useHandleCart(setLocalCart);
  const { handleFavorites, loadingButton: favLoadingButton } = useHandleFavorites(setLocalFavorites);
  const isOnCart = localCart && localCart.some(prod => prod._id === fav._id);
  const isFavorite = localFavorites && localFavorites.some(prod => prod._id === fav._id);

  const newSaleForUsers = fav.sale + 5;
  const newPriceForUsers = (fav.oldPrice - (newSaleForUsers / 100 * fav.oldPrice)).toFixed(2);
  const { state } = useAuthContext();


  return (
    <div className="fav-item">
      {favLoadingButton && <LoadingSpinner isLoading={favLoadingButton} />}

      <button
        aria-label={`Remove ${fav.title} from favorites`} 
        onClick={async () => {
          handleFavorites(fav, isFavorite).then(() => {
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
        className="new-card-btn prod-fav-btn remove-fav-btn"
      >
        <CloseIcon />
      </button>


      <Link
        aria-label={`View details for ${fav.title}`} 
        onClick={async () => {
          setLoading(true);
          await delay(700);
          setLoading(false);
        }}
        className="prod-title-link"
        to={`../${fav.link}/${fav.title.replaceAll(' ', '-')}`}
      >
        <div className="fav-item-img-wrap">
          <LazyProductImage imageName={fav.img} className="fav-item-img" alt={fav.alt} />
        </div>
      </Link>

      <div className="price-cart-wrap">
        <Link
          aria-label={`View details for ${fav.title}`}
          onClick={async () => {
            setLoading(true);
            await delay(700);
            setLoading(false);
          }}
          className="prod-title-link"
          to={`../${fav.link}/${fav.title.replaceAll(' ', '-')}`}
        >
          <p className="prod-title">{fav.title}</p>
        </Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">{state.isLoggedIn? newSaleForUsers : fav.sale}% off</span>
            <span className="limit-txt">Limited Time</span>
          </p>

          <p className="new-card-price">
            <span 
              className="old-price"
              aria-label={`Old price: ${fav.oldPrice}`}
            >
              ${fav.oldPrice.toFixed(2)}
            </span>
            <span className="new-price">
              ${state.isLoggedIn? Number(newPriceForUsers).toFixed(2) : fav.price.toFixed(2)}
            </span>
          </p>

          <div className="button-wrapper">
            <LoadingSpinner isLoading={loadingButton} />

            <button 
              onClick={async () => {
                handleCart(fav, isOnCart).then(() => {
                  setActiveFeedback({ value: 'Cart', action: isOnCart? 'remove' : 'add' });
                  setFeedbackArray(prev => {
                    const newArr = [
                      { value: 'Cart', action: isOnCart? 'remove' : 'add' } as ActiveFeedback, 
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
              className="add-cart-btn new-card-btn"
            >
              {isOnCart? <RemoveFromCartIcon /> : <AddToCartIcon />}
              <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FavoriteItem;