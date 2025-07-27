
import { Link } from 'react-router-dom';

const Favorites = () => {
  return (
    <>
    <section className="favorites-section">
      <h1 className="favorites-title">
        <span className="material-symbols-outlined favorites-icon">favorite</span>
        <span>Favorites</span>
      </h1>
      <p className="favorites-par">You didn't save any favorites yet.</p>

      <Link to="/" className="back-shopping-btn">Back to shopping</Link>
    </section>
    </>
  );
}

export default Favorites;