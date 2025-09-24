import { type Dispatch, type SetStateAction, useState } from 'react';
import useFavoritesContext from '../hooks/useFavoritesContext';
import useHandleFavorites from '../hooks/useHandleFavorites';
import useHandleCart from '../hooks/useHandleCart';
import { useAuthContext } from '../hooks/useAuthContext';

import useCartContext from '../hooks/useCartContext';
import { Link } from 'react-router-dom';
import { forwardRef, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { type ActiveFeedback } from '../pages/Homepage';

import CartFavoritesFeedback from './CartFavoritesFeedback';
import delay from '../utils/delay';
import FavoriteIcon from '../images/icons/favorite-icon.svg?component';
import RemoveFromCartIcon from '../images/icons/remove-shopping-cart-icon.svg?component';
import AddToCartIcon from '../images/icons/add-shopping-cart-icon.svg?component';
import CancelIcon from '../images/icons/cancel-icon.svg?component';
import LazyProductImage from './LazyProductImage';


type FavoritesPropsType = {
  closeModal: () => void,
  isFavoritesHovered: boolean,
  setIsFavoritesHovered: Dispatch<SetStateAction<boolean>>,
  handleMenus: (menu: string) => void
};


const FavoritesMenu = forwardRef<HTMLDivElement, FavoritesPropsType>((
  {
    closeModal,
    isFavoritesHovered,
    setIsFavoritesHovered,
    handleMenus
  }, ref
) => {

  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  const { handleFavorites, loadingButton } = useHandleFavorites(setLocalFavorites);
  const { handleCart, loadingButton: cartLoadingButton } = useHandleCart(setLocalCart);
  
  const [ activeLoadingIndex, setActiveLoadingIndex ] = useState<number | null>(null);
  const { state } = useAuthContext();
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);


  const handleEscape = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setIsFavoritesHovered(false);
      
      const buttonElement = buttonRef.current;
      if (!buttonElement) return;
      buttonElement.focus();
    }
  };


  return (
    <div ref={ref} className="menu">
      { feedbackArray.length > 0 &&
        <ul className="cart-favorites-feedback">
          {feedbackArray.map((feedback, i) => {
            return ( 
              <CartFavoritesFeedback
                key={i}
                value={feedback.value} 
                action={feedback.action}
              />
            );
          })}
        </ul>
      } 

      <button
        ref={buttonRef} 
        aria-label="Favorites"
        aria-expanded={isFavoritesHovered? 'true' : "false"} 
        aria-haspopup="true"
        aria-controls="favorites-menu"
        className="fav-btn header-btn"
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
          handleMenus('favorites');
        }}
      >
        <FavoriteIcon className="header-btn" />
        {localFavorites && localFavorites?.length > 0 && 
          <span 
            aria-label={
              `You have ${localFavorites.length} favorite ${localFavorites.length > 1? 'products' : 'product'}`
            } 
            className="fav-cart-count"
          >
            {localFavorites?.length}
          </span>
        }
      </button>


      {isFavoritesHovered &&
        <div 
          onKeyDown={handleEscape} 
          role="menu" 
          id="favorites-menu" 
          className="menu-content-wrapper"
        > 
          <div onClick={(e) => e.stopPropagation()} className="menu-content">
            <h2 className="section-title">
              <FavoriteIcon />
              <span>Your Favorites</span>
            </h2>


            {localFavorites && localFavorites.map((prod, i) => {
              const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
              const isInCart = localCart && localCart.some(p => p._id === prod._id);
              const slug = prod.title.replaceAll(' ', '-');
              
              const isProdLoading = activeLoadingIndex === i;
              const newSaleForUsers = prod.sale + 5;
              const newPriceForUsers = (prod.oldPrice - (newSaleForUsers / 100 * prod.oldPrice)).toFixed(2);
              
              return (
                <div key={prod._id} className="menu-item">
                  {isProdLoading &&
                    <LoadingSpinner isLoading={loadingButton || cartLoadingButton} 
                  />}

                  <Link
                    role="menuitem"
                    aria-label={`View product details for ${prod.title}`} 
                    onClick={() => setIsFavoritesHovered(false)} 
                    to={`/products/${slug}`}
                  >
                    <LazyProductImage
                      className="menu-item-img"
                      alt={prod.title}
                      imageName={prod.img}
                    />
                  </Link>

                  <Link
                    role="menuitem"  
                    onClick={() => setIsFavoritesHovered(false)} 
                    to={`/products/${slug}`} 
                    className="menu-item-title"
                  >
                    {prod.title}
                  </Link>

                  <p className="menu-item-price">
                    <span className="old-price">{prod.oldPrice.toFixed(2)}</span>
                    <span>
                      ${state.isLoggedIn ? 
                        ((Number(newPriceForUsers) * (prod.quantity || 1))).toFixed(2) : 
                        ((prod.price * (prod.quantity || 1))).toFixed(2)
                      }
                    </span>
                  </p>

                  <button
                    role="menuitem"
                    aria-label="Remove from favorites" 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActiveLoadingIndex(i);
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
                    className="menu-item-btn"
                  >
                    <CancelIcon />
                  </button>

                  <button
                    role="menuitem"
                    aria-label={isInCart? 'Remove from cart' : 'Add to cart'} 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setActiveLoadingIndex(i); 
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
                      });;
                    }}
                    className="menu-item-btn"
                  >
                    {isInCart? <RemoveFromCartIcon /> : <AddToCartIcon />}
                  </button> 
                </div>
              );
            })}


            {localFavorites && localFavorites.length === 0 && 
              <div className="menu-no-item">
                <span>You didn't save any favorites yet...</span>
              </div>
            }
          </div>

          <Link
            role="menuitem" 
            onClick={(e) => {
              e.stopPropagation();
              setIsFavoritesHovered(false);
            }} 
            to="/favorites" 
            className="menu-btn new-card-btn"
          >
            Go to Favorites
          </Link>
        </div>
      }
    </div>
  );
});

export default FavoritesMenu;