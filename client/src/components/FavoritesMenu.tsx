import { type Dispatch, type SetStateAction } from 'react';
import useFavoritesContext from '../hooks/useFavoritesContext';
import useHandleFavorites from '../hooks/useHandleFavorites';

import useHandleCart from '../hooks/useHandleCart';
import useCartContext from '../hooks/useCartContext';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';


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
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart } = useHandleCart(setLocalCart);


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


            {localFavorites && localFavorites.map((prod) => {
              const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
              const isInCart = localCart && localCart.some(p => p._id === prod._id);
              const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
              const slug = prod.title.replaceAll(' ', '-');
              
              return (
                <div key={prod._id} className="fav-hover_prod">
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

                  <p className="fav-hover_prod-price">${prod.price}</p>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavorites(prod, isFavorite);
                    }} 
                    className="fav-hover_remove-btn"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleCart(prod, isInCart);
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
                <span className="material-symbols-outlined fav-hover_fav-icon">favorite</span> 
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