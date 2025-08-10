import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { type NewProductType } from './types';
import type { Dispatch, SetStateAction } from 'react';
import { getProduct } from '../services/getProduct.ts';
import { saveFavoritesLocally, removeFavoriteLocally } from '../utils/localFavorites.ts';
import { FavoritesContext } from '../context/FavoritesContext.tsx';


const NewProduct = (
  { 
    imgSrc,
    encodedQuery,
    item, 
    setIsBtnVisible 
  }:
  { 
    imgSrc: string, 
    encodedQuery: string, 
    item: NewProductType
    setIsBtnVisible: Dispatch<SetStateAction<boolean>>
  }
) => {

  if (!item) return null;
  const [ isFavorite, setIsFavorite ] = useState(false);


  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a <Provider />');
  }
  const { localFavorites, setLocalFavorites } = favContext;


  useEffect(() => {
    if (!item?.id) return;
    const found = localFavorites.some(fav => fav.id === item.id);

    if (found) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [item.id]);


  const handleFavorites = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);

    if (newFavorite) {
      saveFavoritesLocally(item);
      setLocalFavorites(prev => {
        return [ ...prev, item ];
      });
    } else {
      removeFavoriteLocally(item.id);
      setLocalFavorites(prev => {
        const newArr = prev.filter(fav => fav.id !== item.id);
        return newArr;
      });
    }
  }


  return (
    <div className="new-section-card">
      <div className="card-img-wrapper">
        <button 
          onClick={handleFavorites} 
          className="add-fav-btn new-fav-btn">
          <span 
            data-favorite={isFavorite? "true" : "false"}
            className="material-symbols-outlined new-fav-icon"
          >
            favorite
          </span>
        </button>

        <div className="img-wrapper-inner">
          <Link 
            to={`${item.link}/${encodedQuery}`}
            onClick={() => {
              setIsBtnVisible(true)
              getProduct(encodedQuery)
            }}
            className="card-img-link">
            <img className="new-card-img" src={imgSrc} alt={item.alt} />
          </Link>
        </div>
      </div>

      <div className="new-card-details-wrapper">
        <Link 
          to={`${item.link}/${encodedQuery}`}
          onClick={() => {
            setIsBtnVisible(true)
            getProduct(encodedQuery)}
          }
          className="new-card-title">{item.title}</Link>

        <div className="sale-price-wrapper">
          <p className="new-card-sale-limit">
            <span className="sale-txt">{item.sale}% off</span>
            <span className="limit-txt">Limited Time</span>
          </p>
          <p className="new-card-price">
            <span className="old-price">${item.oldPrice}</span>
            <span className="new-price">${item.price}</span>
          </p>
        </div>

        <button className="add-cart-btn new-card-btn">
          <span className="material-symbols-outlined new-cart-icon">
            shopping_cart
          </span>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}

export default NewProduct;