import { type Dispatch, type SetStateAction, useState } from 'react';
import useFavoritesContext from '../hooks/useFavoritesContext';
import useHandleFavorites from '../hooks/useHandleFavorites';
import useHandleCart from '../hooks/useHandleCart';
import { useAuthContext } from '../hooks/useAuthContext';

import useCartContext from '../hooks/useCartContext';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { type ActiveFeedback } from '../pages/Homepage';
import CartFavoritesFeedback from './CartFavoritesFeedback';
import delay from '../utils/delay';


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


  return (
    <div
      ref={ref} 
      className="favorites-menu"
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
        handleMenus('favorites');
      }}
    >
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

      <button className="fav-btn header-btn">
        <span className="material-symbols-outlined header-btn-icon">
          favorite
          {localFavorites && localFavorites?.length > 0 && 
            <span className="fav-cart-count">{localFavorites?.length}</span>}
        </span>
      </button>


      {isFavoritesHovered &&
        <div className="favorites-menu_content-wrapper"> 
          <div onClick={(e) => e.stopPropagation()} className="favorites-menu_content">
            <h1 className="favorites-title">
              <span className="material-symbols-outlined favorites-icon">favorite</span>
              <span>Your Favorites</span>
            </h1>


            {localFavorites && localFavorites.map((prod, i) => {
              const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
              const isInCart = localCart && localCart.some(p => p._id === prod._id);
              const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
              const slug = prod.title.replaceAll(' ', '-');
              
              const isProdLoading = activeLoadingIndex === i;
              const newSaleForUsers = prod.sale + 5;
              const newPriceForUsers = (prod.oldPrice - (newSaleForUsers / 100 * prod.oldPrice)).toFixed(2);
              
              return (
                <div key={prod._id} className="fav-hover_prod">
                  {isProdLoading &&
                    <LoadingSpinner isLoading={loadingButton || cartLoadingButton} 
                  />}

                  <Link onClick={() => setIsFavoritesHovered(false)} to={`/products/${slug}`}>
                    <img className="fav-hover_img" src={imgSrc} />
                  </Link>

                  <Link 
                    onClick={() => setIsFavoritesHovered(false)} 
                    to={`/products/${slug}`} 
                    className="fav-hover_prod-title"
                  >
                    {prod.title}
                  </Link>

                  <p className="fav-hover_prod-price">
                    <span className="old-price">{prod.oldPrice.toFixed(2)}</span>
                    <span>
                      ${state.isLoggedIn ? 
                        ((Number(newPriceForUsers) * (prod.quantity || 1))).toFixed(2) : 
                        ((prod.price * (prod.quantity || 1))).toFixed(2)
                      }
                    </span>
                  </p>

                  <button 
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
                    className="fav-hover_remove-btn"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <button 
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
                    className="fav-hover_remove-btn"
                  >
                    <span className="material-symbols-outlined fav-hover_cart-ico">
                      {isInCart? "remove_shopping_cart" : "add_shopping_cart"}
                    </span>
                  </button> 
                </div>
              );
            })}


            {localFavorites && localFavorites.length === 0 && 
              <div className="fav-hover_menu-no-fav">
                <span>You didn't save any favorites yet...</span>
              </div>
            }
          </div>

          <Link 
              onClick={(e) => {
                e.stopPropagation();
                setIsFavoritesHovered(false);
              }} 
              to="/favorites" 
              className="fav-hover_btn new-card-btn"
            >
              Go to Favorites
            </Link>
        </div>
      }
    </div>
  );
});

export default FavoritesMenu;