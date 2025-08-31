import { Link } from 'react-router-dom';
import useCartContext from "../hooks/useCartContext";

import useFavoritesContext from "../hooks/useFavoritesContext";
import useHandleFavorites from "../hooks/useHandleFavorites";
import useHandleCart from "../hooks/useHandleCart";


const Cart = () => {
  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { handleCart } = useHandleCart(setLocalCart);
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);

  
  const cartProductElements = localCart && localCart.map(prod => {
    const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
    const slug = prod.title.replace(' ', '-');
    const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
    const isInCart = localCart && localCart.some(p => p._id === prod._id);

    return (
      <div key={prod._id} className="cart-product">
        <Link to={`/products/${slug}`}>
          <div className="cart-img-wrapper">
            <img className="cart-img" src={imgSrc} alt={prod.alt} />
          </div>
        </Link>

        <div className="cart-product_ndcolumn">
          <Link className="cart-product_link" to={`/products/${slug}`}>
            <p className="cart-product_title">{prod.title}</p>
          </Link>

          <button
            className="add-cart-btn new-card-btn"
            onClick={() => handleCart(prod, isInCart)}
          > 
            <span className="material-symbols-outlined new-cart-icon">
              shopping_cart
            </span>
            <span>Remove from Cart</span>
          </button>

          <button 
            onClick={() => handleFavorites(prod, isFavorite)} 
            className="new-card-btn prod-fav-btn"
          >
            <span 
              data-favorite={isFavorite? "true" : "false"}
              className="material-symbols-outlined prod-fav-icon"
            >
              favorite
            </span>
            <span>{isFavorite? 'Added to Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>
      </div>
    );
  });


  return (
    <div className="cart-wrapper">
      <h1 className="cart-title">
        <div className="cart-title_wrap">
          <span className="material-symbols-outlined">shopping_cart</span>
          <span>Your Cart</span>
        </div>
        
        {localCart && localCart.length > 0? 
          <div className="cart-title_info">
            You have {localCart.length} {localCart.length > 1? 'products' : 'product'} in your cart
          </div> : 
          <div className="cart-title_info">Your cart is empty</div>
        }
      </h1>

      <div className="cart-products-wrapper">
        {cartProductElements}
      </div>

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </div>
  );
}

export default Cart;