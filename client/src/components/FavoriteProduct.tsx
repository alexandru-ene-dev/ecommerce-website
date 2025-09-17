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


type FavType = {
  setFeedbackArray: Dispatch<SetStateAction<ActiveFeedback[] | []>>,
  setActiveFeedback: Dispatch<SetStateAction<ActiveFeedback | null>>,
  fav: NewProductType
}


const FavoriteProduct = (
  {
    fav,  
    setFeedbackArray, 
    setActiveFeedback 
  }: FavType
) => {
  const imgSrc = new URL(`../assets/images/${fav.img}`, import.meta.url).href;
  const { setLoading } = useLoadingContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  
  const { handleCart, loadingButton } = useHandleCart(setLocalCart);
  const { handleFavorites, loadingButton: favLoadingButton } = useHandleFavorites(setLocalFavorites);
  const isOnCart = localCart && localCart.some(prod => prod._id === fav._id);
  const isFavorite = localFavorites && localFavorites.some(prod => prod._id === fav._id);


  return (
    <div className="fav-prod">
      {favLoadingButton && <LoadingSpinner isLoading={favLoadingButton} />}

      <div className="fav-prod-inner">
        <button 
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
          <span className="material-symbols-outlined prod-fav-icon">
            close
          </span>
        </button>


        <Link 
          onClick={async () => {
            setLoading(true);
            await delay(700);
            setLoading(false);
          }}
          className="prod-title-link"
          to={`../${fav.link}/${fav.title.replaceAll(' ', '-')}`}
        >
          <div className="fav-prod-img-wrap">
            <img className="fav-prod-img" src={imgSrc} alt={fav.alt} />
          </div>
        </Link>

        <div className="price-cart-wrap">
          <Link
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
              <span className="sale-txt">{fav.sale}% off</span>
              <span className="limit-txt">Limited Time</span>
            </p>

            <p className="new-card-price">
              <span className="old-price">${fav.oldPrice}</span>
              <span className="new-price">${fav.price}</span>
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
                <span className="material-symbols-outlined new-cart-icon">
                  {isOnCart? "remove_shopping_cart" : "add_shopping_cart"}
                </span>
                <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FavoriteProduct;