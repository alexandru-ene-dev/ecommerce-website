import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/getProduct";
import { type New } from "../utils/whatsNews";
import { addToFavorites } from "../services/addToFavorites";
import axios from 'axios';

export default function ProductPage() {
  const [ isFavorite, setIsFavorite ]  = useState(false);
  const { name } = useParams();
  const [ productObj, setProductObj ] = useState<Partial<New>>({});
  const [ date, setDate ] = useState('');
  const addCartBtnRef = useRef<HTMLButtonElement | null>(null);
  const intersectionWrapperRef = useRef<HTMLDivElement | null>(null);
  const imgSrc = new URL(`../assets/images/${productObj.img}`, import.meta.url).href;

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

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProduct((name as any));
      setProductObj(product);
    };

    fetchProduct();
  }, []);

  const addFavorites = () => {
    setIsFavorite(prev => {
      const newFavorite = !prev;
      addToFavorites(newFavorite, name as any);
      return newFavorite;
    });
  };

  useEffect(() => {
    const getFavorite = async () => {
      const res = await axios.get(`http://localhost:8383/favorites/${name}`);
      const data = res.data;
      setIsFavorite(data.isFavorite);  
    };

    getFavorite();
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
  
      const handleIntersection: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) { 
            fixedWrapper.classList.add('hide');
          } else {
            fixedWrapper.classList.remove('hide');
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




  return (
    <main>
      <section className="product-wrapper">
        <h1 className="prod-title">{(productObj as any).title || 'Not found'}</h1>
        <div className="prod-flex">
          <div className="prod-img-wrapper">
            <img className="prod-img" src={imgSrc} alt={productObj.alt} />
          </div>

          <div className="prod-price-wrapper">
            <div className="prod-price-inner">
              <div className="prod-sale-price-flex">
                <p className="prod-old-price old-price">${productObj.oldPrice}</p>
                <span className="sale-txt">{productObj.sale}% off</span>
              </div>
              <p className="prod-new-price new-price">${productObj.price}</p>
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
                <img className="intersect-img" src={imgSrc} alt={productObj.alt} />
                <p>{productObj.title}</p>
              </div>

              <div className="intersect-price-btn-flex">
                <div className="intersect-price">
                  <div className="prod-sale-price-flex">
                    <p className="prod-old-price old-price">${productObj.oldPrice}</p>
                    <span className="sale-txt">{productObj.sale}%</span>
                  </div>

                  <p className="prod-new-price new-price">${productObj.price}</p>
                </div>

                <button className="new-card-btn copy-btn">
                  <span className="material-symbols-outlined new-cart-icon">
                    shopping_cart
                  </span>
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>



            <button ref={addCartBtnRef} className="add-cart-btn new-card-btn">
              <span className="material-symbols-outlined new-cart-icon">
                shopping_cart
              </span>
              <span>Add to Cart</span>
            </button>

            <button onClick={addFavorites} className="new-card-btn prod-fav-btn">
              <span 
                data-favorite={isFavorite? "true" : "false"} className="material-symbols-outlined prod-fav-icon"
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