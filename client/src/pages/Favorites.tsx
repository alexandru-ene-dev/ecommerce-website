import { Link } from 'react-router-dom';
import FavoriteProduct from '../components/FavoriteProduct';
import useFavoritesContext from '../hooks/useFavoritesContext';


const Favorites = () => {
  const { localFavorites } = useFavoritesContext();


  return (
    <section className="favorites-section">
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
            'You didn\'t save any favorites yet.'
        }</p>
      </div>

      <div className="fav-container">
        {localFavorites && localFavorites.map(fav => {
          return <FavoriteProduct key={fav.id} fav={fav} />
        })}
      </div>

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default Favorites;