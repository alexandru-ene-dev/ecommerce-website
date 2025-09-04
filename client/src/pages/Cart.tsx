import { Link } from 'react-router-dom';
import useCartContext from "../hooks/useCartContext";
import useFavoritesContext from "../hooks/useFavoritesContext";
import useHandleFavorites from "../hooks/useHandleFavorites";
import useHandleCart from "../hooks/useHandleCart";

import clearUserCart from '../services/clearUserCart';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import delay from '../utils/delay';
import { useState } from 'react';
import { clearLocalCart } from '../utils/cartStorage';


const Cart = () => {
  const { localCart, setLocalCart } = useCartContext();
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { handleCart } = useHandleCart(setLocalCart);
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);

  const [ isDeleteCartMode, setDeleteCartMode ] = useState(false);
  const { state } = useAuthContext();
  const [ status, setStatus ] = useState('');
  const [ isLoading, setLoading ] = useState(false);

  
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


  const clearCart = async () => {
    setLoading(true);
    if (state.isLoggedIn && state?.user?._id) {
      const res = await clearUserCart(state.user._id);
      
      if (!res.success) {
        await delay(700);
        setStatus(res.message);
        setLoading(false);
        return;
      }

      await delay(700);
      setStatus(res.message);
      setLoading(false);
      setDeleteCartMode(false);

      setLocalCart([]);
      await delay(3000);
      setStatus('');

    } else {
      await delay(700);
      setStatus('Products have been cleared');
      setLoading(false);
      clearLocalCart();

      setLocalCart([]);
      setDeleteCartMode(false);
      await delay(3000);
      setStatus('');
    }
  };


  return (
    <section className="favorites-section">
      {status && <p className="clear-status">{status}</p>}

      <div className={!localCart.length? "clear-wrap no-favorites" : "clear-wrap"}>
        <div className="fav-title-txt">
          <h1 className="favorites-title">
            <span className="material-symbols-outlined favorites-icon">shopping_cart</span>
            <span>Your Cart</span>
          </h1>

          <p className="favorites-par">{
            localCart && localCart.length > 0?
              `You have ${localCart.length} ${
                localCart.length > 1? 'products' : 'product'
              } in your cart` : 
              'You cart is empty'
          }</p>
        </div>

        {isDeleteCartMode? 
          (<div className="clear-confirmation">
            <LoadingSpinner isLoading={isLoading} setLoading={setLoading} />
            <p>Are you sure you want to remove all the products from your cart? This action cannot be undone.</p>

            <div>
              <button 
                className="new-card-btn"
                onClick={clearCart}
              >
                Yes, clear cart
              </button>
              <button 
                className="new-card-btn" 
                onClick={() => setDeleteCartMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>) :
          
          (localCart.length?  
            <button 
              onClick={() => setDeleteCartMode(true)} 
              className="new-card-btn"
            >
              Clear Cart
            </button> : null)
        }
      </div>  

      {localCart.length?
        <div className="cart-products-wrapper">
          {cartProductElements}
        </div> : null
      }

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default Cart;