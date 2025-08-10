import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import FavoriteProduct from '../components/FavoriteProduct';
import { FavoritesContext } from '../context/FavoritesContext';


const Favorites = () => {
  const [ message, setMessage ] = useState('');


  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a provider');
  }
  const { localFavorites } = favContext;


  return (
    <>
    <section className="favorites-section">
      <div className="fav-title-txt">
        <h1 className="favorites-title">
          <span className="material-symbols-outlined favorites-icon">favorite</span>
          <span>Favorites</span>
        </h1>

        <p className="favorites-par">{
          localFavorites.length > 0?
            `You have ${localFavorites.length} favorite ${
              localFavorites.length > 1? 'products' : 'product'
            }` : 
            'You didn\'t save any favorites yet.'
        }</p>
      </div>

      <div className="fav-container">
        {localFavorites.map(fav => {
          return <FavoriteProduct key={fav.id} fav={fav} />
        })}
      </div>

      <Link to="/" className="back-shopping-btn new-card-btn">Back to shopping</Link>
    </section>
    </>
  );
}

export default Favorites;