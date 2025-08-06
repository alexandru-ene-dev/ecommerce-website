import Deal from './Deal.tsx';
import { type DealProps } from './Deal'; 
import images from '../assets/images/images.json';
import { type MouseEvent, useRef, useEffect, useState } from 'react';
import { salesText } from '../utils/salesText.ts';
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

const Main = () => {
  const [ haveNewProducts, setHaveNewProducts ] = useState(false);
  const [ newProducts, setNewProducts ] = useState<New[]>([]);
  const saleTextWrapper = useRef<HTMLDivElement>(null);
  const saleIndexRef = useRef<number>(1);
  const slideWidthRef = useRef<number>(0);
  const totalSlidesRef = useRef<number>(0);
  const isSaleTransitioning = useRef(false);

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


  const moveSaleSlide = (index: number) => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    wrapper.style.transition = 'transform 500ms';
    wrapper.style.transform = 
      `translateX(-${slideWidthRef.current * index}px)`;
  };

  // sale text button handlers
  const handlePrev = () => {
    if (isSaleTransitioning.current === true) return;
    isSaleTransitioning.current = true;

    if (!saleTextWrapper.current) return;
    saleIndexRef.current -= 1;
    moveSaleSlide(saleIndexRef.current);
  };

  const handleNext = () => {
    if (isSaleTransitioning.current === true) return;
    isSaleTransitioning.current = true;
    
    if (!saleTextWrapper.current) return;
    saleIndexRef.current += 1;
    moveSaleSlide(saleIndexRef.current);
  };


  // sale text window resize issue fix
  useEffect(() => {
    const handleResize = () => {
      const wrapper = saleTextWrapper.current;
      if (!wrapper) return;

      const slides = wrapper.querySelectorAll('a');
      const slideWidth = slides[0].offsetWidth || 0;
      slideWidthRef.current = slideWidth;

      wrapper.style.transition = 'none';
      wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    if (wrapper.dataset.cloned === 'true') return;

    const slides = wrapper.querySelectorAll('a');
    const slideWidth = slides[0].offsetWidth || 0;
    slideWidthRef.current = slideWidth;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    wrapper.append(firstClone);
    wrapper.prepend(lastClone);
    wrapper.dataset.cloned = 'true';

    const allSlides = wrapper.querySelectorAll('a');
    totalSlidesRef.current = allSlides.length;

    wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
  }, []);
  
  
  // transitionend handler & sale text auto slide
  useEffect(() => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll('a');
    const slideWidth = slides[0].offsetWidth;

    const interval = setInterval(() => {
      if (isSaleTransitioning.current === true) return;
      isSaleTransitioning.current = true;

      saleIndexRef.current += 1;
      wrapper.style.transition = 'transform 500ms';
      wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
    }, 4000);
    
    const handleTransitionEnd = () => {
      const total = totalSlidesRef.current;
      wrapper.style.transition = 'none';
      
      if (saleIndexRef.current >= total - 1) {
        saleIndexRef.current = 1;
        
        wrapper.style.transform =
          `translateX(-${slideWidthRef.current * saleIndexRef.current}px)`;
        
        setTimeout(() => {
          wrapper.style.transition = 'transform 500ms';
        }, 20);
      }
      
      if (saleIndexRef.current <= 0) {
        saleIndexRef.current = total - 2;
        
        wrapper.style.transform =
          `translateX(-${slideWidthRef.current * saleIndexRef.current}px)`;
        
        setTimeout(() => {
          wrapper.style.transition = 'transform 500ms';
        }, 20);
      }

      isSaleTransitioning.current = false;
    };

    wrapper.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      clearInterval(interval);
      wrapper.removeEventListener('transitionend', handleTransitionEnd);
    };
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
      <div className="sales-outer-wrapper">
        <div className="sales-inner-wrapper">
          <button onClick={handlePrev} data-dir="prev">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button onClick={handleNext} data-dir="next">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        
          <div className="sales-width-wrapper">
            <div ref={saleTextWrapper} className="sales-text">
              {salesText.map((txt, i) => <a href="#" key={i}>{txt}</a>)}
            </div>
          </div>
        </div>
      </div>

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
                          onClick={() => getProduct(encodedQuery)}
                          className="card-img-link">
                          <img className="new-card-img" src={imgSrc} alt={item.alt} />
                        </Link>
                      </div>
                    </div>

                    <div className="new-card-details-wrapper">
                      <Link 
                        to={`${item.link}/${encodedQuery}`}
                        onClick={() => getProduct(encodedQuery)}
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