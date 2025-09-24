import { Link } from 'react-router-dom';
import useCartContext from "../hooks/useCartContext";
import clearUserCart from '../services/clearUserCart';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CartFavoritesFeedback from '../components/CartFavoritesFeedback';

import delay from '../utils/delay';
import { useState, useEffect } from 'react';
import { clearLocalCart } from '../utils/cartStorage';
import OrderSummary from '../components/OrderSummary';
import CartItem from '../components/CartItem';
import { type ActiveFeedback } from './Homepage';


const Cart = () => {
  const { localCart, setLocalCart } = useCartContext();
  const [ isDeleteCartMode, setDeleteCartMode ] = useState(false);
  const { state } = useAuthContext();
  const [ status, setStatus ] = useState('');

  const [ isLoading, setLoading ] = useState(false);
  const [ isLoadingCart, setIsLoadingCart ] = useState(true);
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);
  

  const cartProductElements = localCart && localCart.map(prod => {
    return (
      <CartItem
        setFeedbackArray={setFeedbackArray}
        setActiveFeedback={setActiveFeedback}
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
    const handleModes = async () => {
      if (localCart.length <= 0) {
        setDeleteCartMode(false);
      }

      await delay(500);
      setIsLoadingCart(false);
    }

    handleModes();
  }, [localCart.length]);


  if (isLoadingCart) {
    return (
      <section className="items-page loading">
        <h1 className="category-page-title">Loading Cart...</h1>
        <LoadingSpinner isLoading={isLoadingCart} />
      </section>
    );
  }


  return (
    <section className="items-page">
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

      {status && <p role="alert" className="clear-status">{status}</p>}

      <div className={!localCart.length? "clear-wrap no-favorites" : "clear-wrap"}>
        <div className="section-title-wrapper">
          <h1 className="section-title">
            <span>Your Cart</span>
          </h1>

          <p className="items-par">{
            localCart && localCart.length > 0?
              `You have ${localCart.length} ${
                localCart.length > 1? 'products' : 'product'
              } in your cart` : 
              'You cart is empty'
          }</p>
        </div>

        {isDeleteCartMode? 
          (<div
            aria-live="assertive"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation" 
            className="clear-confirmation"
          >
            <LoadingSpinner isLoading={isLoading} />

            <p id="confirmation">Are you sure you want to remove all the products from your cart? This action cannot be undone.</p>

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