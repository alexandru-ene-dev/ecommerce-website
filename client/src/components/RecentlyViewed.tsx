import { useEffect, useState } from 'react';
import { getRecentlyViewed } from '../utils/recentlyViewed';
import { Link } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile';
import delay from '../utils/delay';

import type { NewProductType } from './types';
import useHandleFavorites from '../hooks/useHandleFavorites';
import useFavoritesContext from '../hooks/useFavoritesContext';
import { type Dispatch, type SetStateAction } from 'react';

import { type ActiveFeedback } from '../pages/Homepage.tsx';
import FavoriteIcon from '../images/icons/favorite-icon.svg?component';
import FavoriteFillIcon from '../images/icons/favorite-fill-icon.svg?component';
import LazyProductImage from './LazyProductImage.tsx';


const RecentlyViewedProducts = (
  { setFeedbackArray, setActiveFeedback }:
  {
    setFeedbackArray?: Dispatch<SetStateAction<ActiveFeedback[] | []>>
    setActiveFeedback?: Dispatch<SetStateAction<ActiveFeedback | null>>
  }
) => {
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

          return (
            <div 
              key={product._id}  
              className="recent-product-card"
            >
              <button
                aria-label={`${isFavorite? 'Remove' : 'Add'} ${product.title} from favorites`} 
                onClick={ async (e) => {
                  e.stopPropagation();
                  handleFavorites(product, isFavorite).then(() => {
                    setActiveFeedback?.({ value: 'Favorites', action: isFavorite? 'remove' : 'add' });
                    setFeedbackArray?.(prev => {
                      const newArr = [ 
                        { value: 'Favorites', action: isFavorite? 'remove' : 'add' } as ActiveFeedback,
                        ...prev
                      ];
                      return newArr; 
                    });
                  });
                  
                  await delay(2000);
                  setFeedbackArray?.((prev: any) => {
                    return prev.slice(0, -1); 
                  });
                }} 
                className="add-fav-btn new-fav-btn"
              >
                <FavoriteFillIcon className={isFavorite? "favorite fill" : "favorite"} />
                <FavoriteIcon className="unfill" />
              </button>
              
              <Link aria-label={`View details for ${product.title}`} to={`/products/${slug}`}>
                <div className="recent-img-wrapper">
                  <LazyProductImage 
                    className="new-card-img" 
                    imageName={product.img} 
                    alt={product.title}
                  />
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