import { useEffect, useState } from 'react';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { Link } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';

import type { NewProductType } from './types';
import useHandleFavorites from '../hooks/useHandleFavorites';
import useFavoritesContext from '../hooks/useFavoritesContext';


const RecentlyViewedProducts = () => {
  const [history, setHistory] = useState([]);
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const isMobile = useIsMobile();


  useEffect(() => {
    if (isMobile) {
      const viewed = getRecentlyViewed(6);
      setHistory(viewed);
    } else {
      const viewed = getRecentlyViewed(8);
      setHistory(viewed);
    }
  }, [isMobile]);

  if (!history.length) return null;


  return (
    <section className="recently-viewed">
      <h2 className="section_title">Recently Viewed</h2>

      <div className="recent-product-list">
        {history.map((product: NewProductType) => {
          const isFavorite = localFavorites && localFavorites.some(fav => fav._id === product._id);
          const slug = product.title.replaceAll(' ', '-');
          const imgSrc = new URL(`../assets/images/${product.img}`, import.meta.url).href;

          return (
            <div 
              key={product._id}  
              className="recent-product-card"
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorites(product, isFavorite);
                }} 
                className="add-fav-btn new-fav-btn">
                <span 
                  data-favorite={isFavorite? "true" : "false"}
                  className="material-symbols-outlined new-fav-icon"
                >
                  favorite
                </span>
              </button>
              
              <Link to={`/products/${slug}`}>
                <div className="recent-img-wrapper">
                  <img className="new-card-img" src={imgSrc} alt={product.title} />
                </div>
            
                <p className="new-card-title">{product.title}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;