import { type NewProductType } from "./types";
import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { FavoritesContext } from "../context/FavoritesContext";
import { removeFavoriteLocally } from "../utils/localFavorites";


type FavType = {
  fav: NewProductType
}

const FavoriteProduct = ({ fav }: FavType) => {
  const imgSrc = new URL(`../assets/images/${fav.img}`, import.meta.url).href;


  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a provider');
  }
  const { localFavorites, setLocalFavorites } = favContext;


  const removeFromFavorites = () => {
    removeFavoriteLocally(fav.id);

    setLocalFavorites(prev => {
      const newFavs = prev.filter(f => f.id !== fav.id);
      return newFavs;
    })
  };
  

  return (
    <div className="fav-prod">
      <div className="img-title-wrap">
        <Link to={`../${fav.link}/${fav.title.replaceAll(' ', '-')}`}>
          <img className="fav-prod-img" src={imgSrc} alt={fav.alt} />
        </Link>
        <Link to={`../${fav.link}/${fav.title.replaceAll(' ', '-')}`}>
          <p className="prod-title">{fav.title}</p>
        </Link>
      </div>

      <div className="price-cart-wrap">
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
          <button className="add-cart-btn new-card-btn">
            <span className="material-symbols-outlined new-cart-icon">
              shopping_cart
            </span>
            <span>Add to Cart</span>
          </button>

          <button onClick={() => removeFromFavorites()}className="new-card-btn prod-fav-btn">
            <span className="material-symbols-outlined prod-fav-icon">
              delete
            </span>
            <span>Remove from favorites</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoriteProduct;