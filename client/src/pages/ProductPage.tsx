import { useEffect, useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLocation, useParams } from "react-router-dom";
import RemoveFromCartIcon from '../images/icons/remove-shopping-cart-icon.svg?component';
import AddToCartIcon from '../images/icons/add-shopping-cart-icon.svg?component';
import FavoriteIcon from '../images/icons/favorite-icon.svg?component';
import FavoriteFillIcon from '../images/icons/favorite-fill-icon.svg?component';
import { type NewProductType } from "../components/types";

import useCartContext from '../hooks/useCartContext.ts';
import useFavoritesContext from "../hooks/useFavoritesContext.ts";
import useHandleFavorites from "../hooks/useHandleFavorites.ts";
import useHandleCart from "../hooks/useHandleCart.ts";
import delay from '../utils/delay';

import { addToRecentlyViewed } from "../utils/recentlyViewed.ts";
import RecentlyViewedProducts from "../components/RecentlyViewed.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import CartFavoritesFeedback from '../components/CartFavoritesFeedback';
import { type ActiveFeedback } from './Homepage';
import { useAuthContext } from "../hooks/useAuthContext.ts";
import LazyProductImage from "../components/LazyProductImage.tsx";


export default function ProductPage(
  {
    setIsBtnVisible,
    setStickyBtnHeight
  }:
  {
    setIsBtnVisible: Dispatch<SetStateAction<boolean>>,
    setStickyBtnHeight:  Dispatch<SetStateAction<number>>
  }
) {

  
  const { pathname } = useLocation();
  const { name } = useParams();
  const [ productObj, setProductObj ] = useState<NewProductType | null>(null);
  const [ date, setDate ] = useState('');
  const addCartBtnRef = useRef<HTMLButtonElement | null>(null);

  const intersectionWrapperRef = useRef<HTMLDivElement | null>(null);
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  const isFavorite = localFavorites && localFavorites.some(fav => fav._id === productObj?._id);

  const isOnCart = localCart && localCart.some((fav => fav._id === productObj?._id));  
  const { handleFavorites, loadingButton } = useHandleFavorites(setLocalFavorites);
  const { handleCart, loadingButton: cartLoadingButton } = useHandleCart(setLocalCart);
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);
  const { state } = useAuthContext();

  const newSaleForUsers = (productObj?.sale ?? 0) + 5;
  const newPriceForUsers = 
    ((productObj?.oldPrice ?? 0) - (newSaleForUsers / 100 * (productObj?.oldPrice ?? 0))).toFixed(2);


  // fetch product
  useEffect(() => {
    try {
      const fetchProduct = async () => {
        const { getProduct } = await import('../services/getProduct');
        const product = await getProduct((name as any));
        setProductObj(product);
      };
  
      fetchProduct();
    } catch (err) {
      throw new Error('Couldn\'t fetch the product');
    }
  }, [pathname]);


  useEffect(() => {
    const getDate = () => {
      const deliveryDate = new Date();
      const stringDate = 
        `${deliveryDate.getDate() + 3} ${deliveryDate.toLocaleString('default', { month: 'long'
        })} - ${deliveryDate.getDate() + 5} ${deliveryDate.toLocaleString('default', { month: 'long' })}`;
      
      setDate(stringDate);
    };

    getDate();
  }, []);


  // intersection observer sticky add to cart button
  useEffect(() => {
    const createIntersectionObserver = () => {
      const target = addCartBtnRef.current;
      const fixedWrapper = intersectionWrapperRef.current;

      if (!target || !fixedWrapper) return;
  
      const options: IntersectionObserverInit = {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.5
      };
  
      const handleIntersection: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) { 
            fixedWrapper.classList.add('hide');
            setIsBtnVisible(false);
          } else {
            fixedWrapper.classList.remove('hide');
            setIsBtnVisible(true);
            setStickyBtnHeight(fixedWrapper.offsetHeight);
          }
        });
      };

      const observer = 
        new IntersectionObserver(handleIntersection, options);
      observer.observe(target);

      return () => observer.disconnect();
    };

    createIntersectionObserver();
  }, []);


  useEffect(() => {
    const handleResize = () => {
      const fixedWrapper = intersectionWrapperRef.current;
      if (!fixedWrapper) return;

      setStickyBtnHeight(fixedWrapper.offsetHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // add to recently viewed
  useEffect(() => {
    if (!productObj) return;

    addToRecentlyViewed(productObj, 10);
  }, [productObj]);


  return (
    <main>
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
      <section className="product-wrapper">
        <h1 className="prod-title">{productObj?.title}</h1>

        <div className="prod-flex">
          <div className="prod-img-wrapper">
            <LazyProductImage
              className="prod-img"
              alt={productObj?.alt}
              imageName={productObj?.img}
            />
          </div>

          <div className="prod-price-wrapper">
            <div className="prod-price-inner">
              <div className="prod-sale-price-flex">
                <p className="prod-old-price old-price">${productObj?.oldPrice.toFixed(2)}</p>
                <span className="sale-txt">
                  {state.isLoggedIn? newSaleForUsers : productObj?.sale}% off
                </span>
              </div>

              <p className="prod-new-price new-price">
                ${state.isLoggedIn? 
                  Number(newPriceForUsers).toFixed(2) :
                  productObj?.price.toFixed(2)
                }
              </p>
            </div>

            <p className="in-stock">
              <span className="in-stock-icon">&#10003;</span> 
              In Stock
            </p>

            <p className="estimated-delivery">
              <span className="estimated-delivery-txt">Estimated Delivery:</span>
              <span className="delivery-date">{date}</span> 
            </p>
            <p className="delivery-fee">
              <span className="delivery-fee-txt">Delivery Fee:</span> 
              <span className="delivery-fee-span">starting from $10</span>
            </p>

            <div className="button-wrapper">
              {cartLoadingButton && <LoadingSpinner isLoading={cartLoadingButton} />}

              <button 
                onClick={async () => {
                  if (productObj) {
                    handleCart(productObj, isOnCart).then(() => {
                      setActiveFeedback({ value: 'Cart', action: isOnCart? 'remove' : 'add' });
                      setFeedbackArray(prev => {
                        const newArr = [
                          { value: 'Cart', action: isOnCart? 'remove' : 'add' } as ActiveFeedback, 
                          ...prev 
                        ];
                        return newArr; 
                      });
                    });

                    await delay(2000);
                    setFeedbackArray((prev: any) => {
                      return prev.slice(0, -1); 
                    });
                  }
                }} 
                ref={addCartBtnRef} 
                className="add-cart-btn new-card-btn"
              >
                {isOnCart? <RemoveFromCartIcon /> : <AddToCartIcon />}
                <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
              </button>
            </div>

            <div className="button-wrapper">
              {loadingButton && <LoadingSpinner isLoading={loadingButton} />}

              <button 
                onClick={async () => {
                  if (productObj) {
                    handleFavorites(productObj, isFavorite).then(() => {
                      setActiveFeedback({ value: 'Favorites', action: isFavorite? 'remove' : 'add' });
                      setFeedbackArray(prev => {
                        const newArr = [ 
                          { value: 'Favorites', action: isFavorite? 'remove' : 'add' } as ActiveFeedback,
                          ...prev
                        ];
                        return newArr; 
                      });
                    });
            
                    await delay(2000);
                    setFeedbackArray((prev: any) => {
                      return prev.slice(0, -1); 
                    });
                  }
                }} 
                className="add-cart-btn new-card-btn prod-fav-btn"
              >
                <span>
                  <FavoriteFillIcon className={isFavorite? "favorite fill" : "favorite"} />
                  <FavoriteIcon className="unfill" />
                </span>
                <span>{isFavorite? 'Added to Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>

        </div>
        
        <RecentlyViewedProducts />

        <div ref={intersectionWrapperRef} className="intersection-wrapper">
          <div className="intersect-img-flex">
            <LazyProductImage
              className="intersect-img"
              alt={productObj?.alt}
              imageName={productObj?.img}
            />
            <p>{productObj?.title}</p>
          </div>

          <div className="intersect-price-btn-flex">
            <div className="intersect-price">
              <div className="prod-sale-price-flex">
                <p 
                  aria-label={`Old price: ${productObj?.oldPrice}`} 
                  className="prod-old-price old-price"
                >
                  ${productObj?.oldPrice.toFixed(2)}
                </p>
                <span className="sale-txt">{productObj?.sale}%</span>
              </div>

              <p className="prod-new-price new-price">
                ${state.isLoggedIn? 
                  Number(newPriceForUsers).toFixed(2) :
                  productObj?.price.toFixed(2)
                }
              </p>
            </div>

            <div className="button-wrapper">
              <LoadingSpinner isLoading={cartLoadingButton} />

              <div>
                <button 
                  onClick={async () => {
                    if (productObj) {
                      handleCart(productObj, isOnCart).then(() => {
                        setActiveFeedback({ value: 'Cart', action: isOnCart? 'remove' : 'add' });
                        setFeedbackArray(prev => {
                          const newArr = [
                            { value: 'Cart', action: isOnCart? 'remove' : 'add' } as ActiveFeedback, 
                            ...prev 
                          ];
                          return newArr; 
                        });
                      });

                      await delay(2000);
                      setFeedbackArray((prev: any) => {
                        return prev.slice(0, -1); 
                      });
                    }
                  }} 
                  className="new-card-btn copy-btn"
                >
                  {isOnCart? <RemoveFromCartIcon /> : <AddToCartIcon />}
                  <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};