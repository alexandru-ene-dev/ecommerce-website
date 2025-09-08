import { type NewProductType } from "./types";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import useLoadingContext from "../hooks/useLoadingContext";
import delay from "../utils/delay";

import useCartContext from "../hooks/useCartContext";
import useFavoritesContext from "../hooks/useFavoritesContext";
import useHandleCart from "../hooks/useHandleCart";
import useHandleFavorites from "../hooks/useHandleFavorites";


type FavType = {
  fav: NewProductType
}


const FavoriteProduct = ({ fav }: FavType) => {
  const imgSrc = new URL(`../assets/images/${fav.img}`, import.meta.url).href;
  const { setLoading } = useLoadingContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  const { handleCart } = useHandleCart(setLocalCart);

  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const isOnCart = localCart && localCart.some(prod => prod._id === fav._id);
  const isFavorite = localFavorites && localFavorites.some(prod => prod._id === fav._id);
  const [ error, setError ] = useState<string | null>(null);


  return (
    <div className="fav-prod">
      <div className="fav-prod-inner">
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
          </div>

          <div className="fav-btns-wrap">
            <button onClick={() => handleCart(fav, isOnCart)} className="add-cart-btn new-card-btn">
              <span className="material-symbols-outlined new-cart-icon">
                shopping_cart
              </span>
              <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
            </button>

            <button onClick={() => handleFavorites(fav, isFavorite)}className="new-card-btn prod-fav-btn">
              <span className="material-symbols-outlined prod-fav-icon">
                delete
              </span>
              <span>Remove from Favorites</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProduct;