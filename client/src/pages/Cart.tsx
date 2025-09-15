import { Link } from 'react-router-dom';
import useCartContext from "../hooks/useCartContext";
import clearUserCart from '../services/clearUserCart';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

import delay from '../utils/delay';
import { useState, useEffect } from 'react';
import { clearLocalCart } from '../utils/cartStorage';
import OrderSummary from '../components/OrderSummary';
import CartItem from '../components/CartItem';


const Cart = () => {
  const { localCart, setLocalCart } = useCartContext();
  const [ isDeleteCartMode, setDeleteCartMode ] = useState(false);
  const { state } = useAuthContext();
  const [ status, setStatus ] = useState('');
  const [ isLoading, setLoading ] = useState(false);


  const cartProductElements = localCart && localCart.map(prod => {
    return (
      <CartItem
        key={prod._id} 
        prod={prod}
      />
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


  useEffect(() => {
    if (localCart.length <= 0) {
      setDeleteCartMode(false);
    }
  }, [localCart.length]);


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
            <LoadingSpinner isLoading={isLoading} />

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
        <div className="cart-grid">
          {isLoading && <LoadingSpinner isLoading={isLoading} />}
          
          <div className="cart-products-wrapper">
            {cartProductElements}
          </div>

          {localCart.length && <OrderSummary cart={localCart} />}
        </div> : null
      }

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default Cart;