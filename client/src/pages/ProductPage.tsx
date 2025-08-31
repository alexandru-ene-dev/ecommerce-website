import { useEffect, useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getProduct } from "../services/getProduct";
import { type NewProductType } from "../components/types";

import useCartContext from '../hooks/useCartContext.ts';
import useFavoritesContext from "../hooks/useFavoritesContext.ts";
import useHandleFavorites from "../hooks/useHandleFavorites.ts";
import useHandleCart from "../hooks/useHandleCart.ts";


export default function ProductPage(
  {
    setIsBtnVisible,
    setStickyBtnHeight
  }:
  {
    isBtnVisible: boolean,
    setIsBtnVisible: Dispatch<SetStateAction<boolean>>,
    stickyBtnHeight: number,
    setStickyBtnHeight:  Dispatch<SetStateAction<number>>
  }
) {

  const { pathname } = useLocation();
  const { name } = useParams();
  const [ productObj, setProductObj ] = useState<NewProductType | null>(null);
  const [ date, setDate ] = useState('');
  const addCartBtnRef = useRef<HTMLButtonElement | null>(null);

  const intersectionWrapperRef = useRef<HTMLDivElement | null>(null);
  const imgSrc = new URL(`../assets/images/${productObj?.img}`, import.meta.url).href;
  const { localFavorites, setLocalFavorites } = useFavoritesContext();
  const { localCart, setLocalCart } = useCartContext();
  // const [ error, setError ] = useState<string | null>(null);

  const isFavorite = localFavorites && localFavorites.some(fav => fav._id === productObj?._id);
  const isOnCart = localCart && localCart.some((fav => fav._id === productObj?._id));  
  const { handleFavorites } = useHandleFavorites(setLocalFavorites);
  const { handleCart } = useHandleCart(setLocalCart);


  // fetch product
  useEffect(() => {
    try {
      const fetchProduct = async () => {
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


  return (
    <main>
      <section className="product-wrapper">
        <h1 className="prod-title">{productObj?.title || 'Not found'}</h1>
        <div className="prod-flex">
          <div className="prod-img-wrapper">
            <img className="prod-img" src={imgSrc} alt={productObj?.alt} />
          </div>

          <div className="prod-price-wrapper">
            <div className="prod-price-inner">
              <div className="prod-sale-price-flex">
                <p className="prod-old-price old-price">${productObj?.oldPrice}</p>
                <span className="sale-txt">{productObj?.sale}% off</span>
              </div>
              <p className="prod-new-price new-price">${productObj?.price}</p>
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
              <span className="delivery-fee-span">starting from $20</span>
            </p>

            <div ref={intersectionWrapperRef} className="intersection-wrapper">
              <div className="intersect-img-flex">
                <img className="intersect-img" src={imgSrc} alt={productObj?.alt} />
                <p>{productObj?.title}</p>
              </div>

              <div className="intersect-price-btn-flex">
                <div className="intersect-price">
                  <div className="prod-sale-price-flex">
                    <p className="prod-old-price old-price">${productObj?.oldPrice}</p>
                    <span className="sale-txt">{productObj?.sale}%</span>
                  </div>

                  <p className="prod-new-price new-price">${productObj?.price}</p>
                </div>

                <button 
                  onClick={() => {
                    if (productObj) handleCart(productObj, isOnCart);
                  }} 
                  className="new-card-btn copy-btn"
                >
                  <span className="material-symbols-outlined new-cart-icon">
                    shopping_cart
                  </span>
                  <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                if (productObj) handleCart(productObj, isOnCart);
              }} 
              ref={addCartBtnRef} 
              className="add-cart-btn new-card-btn"
            >
              <span className="material-symbols-outlined new-cart-icon">
                shopping_cart
              </span>
              <span>{isOnCart? 'Remove from Cart' : 'Add to Cart'}</span>
            </button>

            <button 
              onClick={() => {
                if (productObj) handleFavorites(productObj, isFavorite);
              }} 
              className="new-card-btn prod-fav-btn"
            >
              <span 
                data-favorite={isFavorite? "true" : "false"}
                className="material-symbols-outlined prod-fav-icon"
              >
                favorite
              </span>
              <span>{isFavorite? 'Added to Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>

        </div>
      </section>
    </main>
  );
};