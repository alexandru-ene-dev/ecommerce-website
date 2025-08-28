import { type NewProductType } from "./types";
import { Link } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { FavoritesContext } from "../context/FavoritesContext";
import { removeFavoriteLocally } from "../utils/localFavorites";
import useLoadingContext from "../hooks/useLoadingContext";
import delay from "../utils/delay";
import useCartContext from "../hooks/useCartContext";
import { isInCart, removeFromCart, addToCart } from "../utils/cartStorage";


type FavType = {
  fav: NewProductType
}

const FavoriteProduct = ({ fav }: FavType) => {
  const imgSrc = new URL(`../assets/images/${fav.img}`, import.meta.url).href;


  const { setLoading } = useLoadingContext();


  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a provider');
  }
  const { localFavorites, setLocalFavorites } = favContext;


  const [ isOnCart, setIsOnCart ] = useState(false);
  const { localCart, setLocalCart } = useCartContext();

  const [ error, setError ] = useState<string | null>(null);


  const removeFromFavorites = () => {
    removeFavoriteLocally(fav.id);

    setLocalFavorites(prev => {
      const newFavs = prev.filter(f => f.id !== fav.id);
      return newFavs;
    });
  };


  useEffect(() => {
    setIsOnCart(isInCart(fav._id));
  }, [fav._id]);


  const handleCart = async () => {
    try {
      if (isOnCart) {
        removeFromCart(fav._id);
        setLocalCart(prev => {
          const newLocalCart = prev.filter(p => p._id !== fav._id);
          return newLocalCart;
        });
      } else {
        addToCart(fav);
        setLocalCart(prev => {
          const newLocalCart = [ ...prev, fav ];
          return newLocalCart;
        });
      }
      
      setIsOnCart(!isOnCart);
    } catch (err) {
      setError((err as Error).message);
    }
  };
  

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
            <button onClick={handleCart} className="add-cart-btn new-card-btn">
              <span className="material-symbols-outlined new-cart-icon">
                shopping_cart
              </span>
              <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
            </button>

            <button onClick={() => removeFromFavorites()}className="new-card-btn prod-fav-btn">
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