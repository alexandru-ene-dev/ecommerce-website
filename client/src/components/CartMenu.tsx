import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import useFavoritesContext from '../hooks/useFavoritesContext';
import useHandleFavorites from '../hooks/useHandleFavorites';
import { useAuthContext } from '../hooks/useAuthContext';
import delay from '../utils/delay';

import { type ActiveFeedback } from '../pages/Homepage';
import useHandleCart from '../hooks/useHandleCart';
import useCartContext from '../hooks/useCartContext';
import { Link } from 'react-router-dom';
import { forwardRef, useRef } from 'react';

import LoadingSpinner from './LoadingSpinner';
import CartFavoritesFeedback from './CartFavoritesFeedback';
import ShoppingCartIcon from '../images/icons/shopping-cart-icon.svg?component';
import CancelIcon from '../images/icons/cancel-icon.svg?component';
import FavoriteIcon from '../images/icons/favorite-icon.svg?component';
import FavoriteFillIcon from '../images/icons/favorite-fill-icon.svg?component';
import LazyProductImage from './LazyProductImage';


type CartPropsType = {
  handleMenus: (menu: string) => void,
  closeModal: () => void,
  isCartHovered: boolean,
  setIsCartHovered: Dispatch<SetStateAction<boolean>>
};


const CartMenu = forwardRef<HTMLDivElement, CartPropsType>((
  {
    handleMenus,
    closeModal,
    isCartHovered,
    setIsCartHovered
  }, ref
) => {

  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  const { handleFavorites, loadingButton } = useHandleFavorites(setLocalFavorites);
  const { handleCart, loadingButton: cartLoadingButton } = useHandleCart(setLocalCart);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  const [ totalPrice, setTotalPrice ] = useState(0);
  const [ activeLoadingIndex, setActiveLoadingIndex ] = useState<number | null>(null);
  const { state } = useAuthContext();
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);


  useEffect(() => {
    const getTotalPrice = () => {
      const prices = localCart.map(prod => prod.price);

      if (!prices || !Array.isArray(prices)) {
        return;
      };

      const total = prices.reduce((acc, val) => acc + val, 0);
      setTotalPrice(total);
    };

    getTotalPrice();
  }, [localCart]);


  const handleEscape = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setIsCartHovered(false);
      
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
        aria-label="Cart"
        aria-controls="cart-menu"
        aria-expanded={isCartHovered? 'true' : 'false'}
        aria-haspopup="true" 
        className="fav-btn header-btn"
        onClick={(e) => {
        e.stopPropagation();
        closeModal();
        handleMenus('cart');
      }}
      >
        <ShoppingCartIcon className="header-btn" />
        {localCart && localCart?.length > 0 && 
          <span
            aria-label={
              `You have ${localCart.length} ${localFavorites.length > 1? 'products' : 'product'} in your cart`
            }  
            className="fav-cart-count"
          >
            {localCart?.length}
          </span>
        }
      </button>


      {isCartHovered &&
        <div
          onKeyDown={handleEscape} 
          role="menu" 
          id="cart-menu" 
          className="menu-content-wrapper"
        > 
          <div onClick={(e) => e.stopPropagation()} className="menu-content">
            <h2 className="section-title">
              <ShoppingCartIcon />
              <span>Your Cart</span>
            </h2>


            {localCart && localCart.map((prod, i) => {
              const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
              const isInCart = localCart && localCart.some(p => p._id === prod._id);
              const slug = prod.title.replaceAll(' ', '-');
              
              const isProdLoading = activeLoadingIndex === i;
              const newSaleForUsers = prod.sale + 5;
              const newPriceForUsers = (prod.oldPrice - (newSaleForUsers / 100 * prod.oldPrice)).toFixed(2);
              
              return (
                <div key={prod._id} className="menu-item">
                  {isProdLoading &&
                    <LoadingSpinner isLoading={loadingButton || cartLoadingButton} />
                  }

                  <Link
                    role="menuitem" 
                    aria-label={`View details for ${prod.title}`} 
                    onClick={() => setIsCartHovered(false)} 
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
                    onClick={() => setIsCartHovered(false)} 
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
                    aria-label="Remove from cart" 
                    onClick={ async () => {
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
                      });
                    }}
                    className="menu-item-btn"
                  >
                    <CancelIcon />
                  </button>

                  <button
                    role="menuitem"
                    aria-label={isFavorite? 'Remove from favorites' : 'Add to favorites'}  
                    onClick={async () => {
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
                    className="add-fav-btn new-fav-btn menu-item-btn"
                  >
                    <FavoriteFillIcon className={isFavorite? "favorite fill" : "favorite"} />
                    <FavoriteIcon className="unfill" />
                  </button>
                </div>
              );
            })}


            {localCart && localCart.length === 0 && 
              <div className="menu-no-item">
                Your cart is empty...
              </div>
            }
          </div>

          <div className="go-cart-wrap">
            {totalPrice > 0 && 
              <div className="price-info-wrapper">
                <p>
                  Total price ({localCart.length} {localCart.length > 1? 'products' : 'product'})
                </p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
            }

            <Link
              role="menuitem" 
              onClick={(e) => {
                e.stopPropagation();
                setIsCartHovered(false);
              }} 
              to="/cart" 
              className="menu-btn new-card-btn"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      }
    </div>  
  );
});

export default CartMenu;