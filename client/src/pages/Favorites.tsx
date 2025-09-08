import { Link } from 'react-router-dom';
import FavoriteProduct from '../components/FavoriteProduct';
import useFavoritesContext from '../hooks/useFavoritesContext';
import { useState } from 'react';
import { clearLocalFavorites } from '../utils/localFavorites';

import clearUserFavorites from '../services/clearUserFavorites';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import delay from '../utils/delay';


const Favorites = () => {
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const [ isDeleteFavoritesMode, setDeleteFavoritesMode ] = useState(false);
  const { state } = useAuthContext();
  const [ status, setStatus ] = useState('');
  const [ isLoading, setLoading ] = useState(false);


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


  return (
    <section className="favorites-section">
      {status && <p className="clear-status">{status}</p>}

      <div className={!localFavorites.length? "clear-wrap no-favorites" : "clear-wrap"}>
        <div className="fav-title-txt">
          <h1 className="favorites-title">
            <span className="material-symbols-outlined favorites-icon">favorite</span>
            <span>Your Favorites</span>
          </h1>

          <p className="favorites-par">{
            localFavorites && localFavorites.length > 0?
              `You have ${localFavorites.length} favorite ${
                localFavorites.length > 1? 'products' : 'product'
              }` : 
              'You didn\'t save any favorites yet'
          }</p>
        </div>

        {isDeleteFavoritesMode? 
          (<div className="clear-confirmation">
            <LoadingSpinner isLoading={isLoading} />
            <p>Are you sure you want to remove all your favorite products? This action cannot be undone.</p>

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
              onClick={() => setDeleteFavoritesMode(true)} 
              className="new-card-btn"
            >
              Clear All Favorites
            </button> : null)
        }
      </div>

      {localFavorites.length?  
        <div className="fav-container">
          {localFavorites && localFavorites.map(fav => {
            return <FavoriteProduct key={fav.id} fav={fav} />
          })}
        </div> : null
      }

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default Favorites;