import { type Dispatch, type SetStateAction, useState, useEffect } from 'react';
import useFavoritesContext from '../hooks/useFavoritesContext';
import useHandleFavorites from '../hooks/useHandleFavorites';
import { useAuthContext } from '../hooks/useAuthContext';

import useHandleCart from '../hooks/useHandleCart';
import useCartContext from '../hooks/useCartContext';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';


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
  
  const [ totalPrice, setTotalPrice ] = useState(0);
  const [ activeLoadingIndex, setActiveLoadingIndex ] = useState<number | null>(null);
  const { state } = useAuthContext();



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

  
  return (
    <div
      ref={ref} 
      className="favorites-menu"
      onClick={(e) => {
        e.stopPropagation();
        closeModal();
        handleMenus('cart');
      }}
    >
      <button className="fav-btn header-btn">
        <span className="material-symbols-outlined header-btn-icon">
          shopping_cart
          {localCart && localCart?.length > 0 && 
            <span className="fav-cart-count">{localCart?.length}</span>}
        </span>
      </button>


      {isCartHovered &&
        <div className="favorites-menu_content-wrapper"> 
          <div onClick={(e) => e.stopPropagation()} className="favorites-menu_content">
            <h1 className="favorites-title">
              <span className="material-symbols-outlined favorites-icon">shopping_cart</span>
              <span>Your Cart</span>
            </h1>


            {localCart && localCart.map((prod, i) => {
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
                    <LoadingSpinner isLoading={loadingButton || cartLoadingButton} />
                  }

                  <Link onClick={() => setIsCartHovered(false)} to={`/products/${slug}`}>
                    <img className="fav-hover_img" src={imgSrc} />
                  </Link>

                  <Link onClick={() => setIsCartHovered(false)} to={`/products/${slug}`} className="fav-hover_prod-title">
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
                    onClick={() => {
                      setActiveLoadingIndex(i);
                      handleCart(prod, isInCart);
                    }}
                    className="fav-hover_remove-btn"
                  >
                    <span className="material-symbols-outlined fav-hover_cart-ico">
                      {isInCart? "remove_shopping_cart" : "add_shopping_cart"}
                    </span>
                  </button>

                  <button 
                    onClick={() => {
                      setActiveLoadingIndex(i);
                      handleFavorites(prod, isFavorite);
                    }} 
                    className="add-fav-btn new-fav-btn fav-hover_remove-btn"
                  >
                    <span 
                      data-favorite={isFavorite? "true" : "false"}
                      className="material-symbols-outlined new-fav-icon"
                    >
                      favorite
                    </span>
                  </button>
                </div>
              );
            })}


            {localCart && localCart.length === 0 && 
              <div className="fav-hover_menu-no-fav">
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
              onClick={(e) => {
                e.stopPropagation();
                setIsCartHovered(false);
              }} 
              to="/cart" 
              className="cart-hover_btn new-card-btn"
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