import { Link } from 'react-router-dom';
import FavoriteItem from '../components/FavoriteItem';
import useFavoritesContext from '../hooks/useFavoritesContext';
import { useState, useEffect, useRef } from 'react';
import { clearLocalFavorites } from '../utils/localFavorites';
import clearUserFavorites from '../services/clearUserFavorites';

import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import delay from '../utils/delay';
import CartFavoritesFeedback from '../components/CartFavoritesFeedback';
import { type ActiveFeedback } from './Homepage';


const Favorites = () => {
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const [ isDeleteFavoritesMode, setDeleteFavoritesMode ] = useState(false);
  const { state } = useAuthContext();
  const [ status, setStatus ] = useState('');

  const [ isLoading, setLoading ] = useState(false);
  const [ isLoadingFav, setIsLoadingFav ] = useState(true);
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);
  const clearFavoritesBtnRef = useRef<HTMLButtonElement | null>(null);


  const clearFavorites = async () => {
    setLoading(true);
    if (state.isLoggedIn && state?.user?._id) {
      const res = await clearUserFavorites(state.user._id);
      
      if (!res.success) {
        await delay(700);
        setStatus(res.message);
        setLoading(false);
        return;
      }

      await delay(700);
      setStatus(res.message);
      setLoading(false);
      setDeleteFavoritesMode(false);

      setLocalFavorites([]);
      await delay(3000);
      setStatus('');

    } else {
      await delay(700);
      setStatus('All favorites have been cleared');
      clearLocalFavorites();
      setLoading(false);

      setLocalFavorites([]);
      setDeleteFavoritesMode(false);
      await delay(3000);
      setStatus('');
    }
  };


  useEffect(() => {
    const handleModes = async () => {
      if (localFavorites.length <= 0) {
        setDeleteFavoritesMode(false);
      }

      await delay(500);
      setIsLoadingFav(false);
    }

    handleModes();
  }, [localFavorites.length]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDeleteFavoritesMode) {
        setDeleteFavoritesMode(false);

        const clearRef = clearFavoritesBtnRef.current;
        if (!clearRef) return;
        clearRef.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDeleteFavoritesMode]);


  if (isLoadingFav) {
    return (
      <section className="items-page loading">
        <h1 className="category-page-title">Loading Favorites...</h1>
        <LoadingSpinner isLoading={isLoadingFav} />
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

      <div className={!localFavorites.length? "clear-wrap no-favorites" : "clear-wrap"}>

        <div className="section-title-wrapper">
          <h1 className="section-title">
            <span>Your Favorites</span>
          </h1>

        
          <p className="items-par">
            {
            localFavorites.length > 0 ?
              `You have ${localFavorites.length} favorite ${
                localFavorites.length > 1? 'products' : 'product'
              }` : 
              'You didn\'t save any favorites yet'
            }
          </p>
        </div>
        

        {isDeleteFavoritesMode?
          (<div 
            role="dialog"
            aria-live="assertive" 
            aria-modal="true" 
            aria-labelledby="confirmation" 
            className="clear-confirmation"
          >
            <LoadingSpinner isLoading={isLoading} />
            <p id="confirmation">Are you sure you want to remove all your favorite products? This action cannot be undone.</p>

            <div>
              <button 
                className="new-card-btn"
                onClick={clearFavorites}
              >
                Yes, remove all favorites
              </button>
              <button 
                className="new-card-btn" 
                onClick={() => setDeleteFavoritesMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>) :
          
          (localFavorites.length?  
            <button
              ref={clearFavoritesBtnRef} 
              onClick={() => setDeleteFavoritesMode(true)} 
              className="new-card-btn"
            >
              Clear All Favorites
            </button> : null
          )
        }
      </div>

      {localFavorites.length?  
        <div className="item-container">
          {isLoading && <LoadingSpinner isLoading={isLoading}/>}

          {localFavorites && localFavorites.map(fav => {
            return (
              <FavoriteItem 
                setFeedbackArray={setFeedbackArray}
                setActiveFeedback={setActiveFeedback}
                key={fav.id} 
                fav={fav} 
              />
            )
          })}
        </div> : null
      }

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default Favorites;