import Deal from './Deal.tsx';
import { type DealProps } from './Deal'; 
import images from '../assets/images/images.json';
import { 
  useRef, useEffect, useState, 
  type MouseEvent, type SetStateAction,
  type Dispatch
} from 'react';

import { whatsNew } from '../utils/whatsNews.ts';
import { getHomeNewProducts } from '../services/getHomeNewProducts.ts';
import { getProduct } from '../services/getProduct.ts'
import { Link } from 'react-router-dom';

type New = {
  id: number,
  title: string,
  img: string,
  alt: string,
  oldPrice: number,
  price: number,
  sale: number
  link: string
}

const Main = (
  { 
    setIsBtnVisible, 
  }:
  { 
    setIsBtnVisible: Dispatch<SetStateAction<boolean>> 
  }
) => {
  const [ haveNewProducts, setHaveNewProducts ] = useState(false);
  const [ newProducts, setNewProducts ] = useState<New[]>([]);

  const joinUsImg = new URL('../assets/images/join-us.jpg', import.meta.url).href;

  const dealSlideRef = useRef<HTMLUListElement>(null);
  const dealElements = images.map(({ text, src, alt, active, id }: DealProps) => {
    const imageUrl = new URL(`../assets/images/${src}`, import.meta.url).href;

    return (
      <Deal
        key={id}
        text={text}
        src={imageUrl}
        alt={alt}
        active={active} 
        id={id}
      />
    )
  });

  const changeSlide = (e: MouseEvent<HTMLButtonElement>): void => {
    const target = e.currentTarget as HTMLButtonElement;
    const container = dealSlideRef.current;
    const direction = target.dataset.direction;

    if (!container) return;

    const slideWidth = container.clientWidth;
    const maxScroll = container.scrollWidth - slideWidth;
    const currentScroll = container.scrollLeft;

    if (direction === 'right') {
      if (currentScroll >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    } else if (direction === 'left') {
      if (currentScroll <= 0) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const container = dealSlideRef.current;
      if (!container) return;
      
      const slideWidth = container.clientWidth;
      const maxScroll = container.scrollWidth - slideWidth;
      const currentScroll = container.scrollLeft;
      
      if (currentScroll >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    }, 5000); 
    return () => clearTimeout(interval);
  }, []);


useEffect(() => {
  const getProducts = async () => {
    const products = await getHomeNewProducts();

    if (!products.success) {
      setHaveNewProducts(false);
      setNewProducts([]);
      return;
    }

    setHaveNewProducts(true);
    setNewProducts(products.products);
  };

  getProducts();
}, []);

  return (
    <>
      <h1 className="title">
        Future is here! Explore latest tech with smartest prices.
      </h1>
      <main>
        <section className="new-deals-section">
          <div className="controllers-wrapper">
            <button data-direction="left" onClick={changeSlide} className="controller left-controller">
              <span className="controller-icon">&#8678;</span>
            </button>
            <button data-direction="right" onClick={changeSlide}className="controller right-controller">
              <span className="controller-icon">&#8680;</span>
            </button>
          </div>

          <ul ref={dealSlideRef} className="deals-list">
            {dealElements}
          </ul>
        </section>

        <div className="join-wrapper">
          <a href="#">
            <div className="join-img-wrapper">
              <img 
                className="join-img" 
                src={joinUsImg} 
                alt="A tech office with people working" />
              <p className="join-par">Join us</p>
              <p className="join-par-sec">Cheaper Gear - 25% off when you join!</p>
            </div>
          </a>
        </div>


        {haveNewProducts && <div className="new-section">
          <h2 className="new-section_title">What's New?</h2>

          <div className="new-section-grid-wrapper">
            <div className="new-section-grid">
              {newProducts.map(item => {
                const imgSrc = new URL(`../assets/images/${item.img}`, import.meta.url).href;
                const encodedQuery = item.title.replaceAll(' ', '-');
                return (
                  <div key={item.id} className="new-section-card">
                    <div className="card-img-wrapper">
                      <button className="add-fav-btn new-fav-btn">
                        <span className="material-symbols-outlined new-fav-icon">favorite</span>
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
                )
              })}
            </div>
          </div>
        </div>}

      </main>
    </>
  );
};

export default Main;