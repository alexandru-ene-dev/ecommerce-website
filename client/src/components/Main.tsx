import Deal from './Deal.tsx';
import { type DealProps } from './Deal'; 
import images from '../assets/images/images.json';
import { 
  useRef, useEffect, useState, 
  type MouseEvent, type SetStateAction,
  type Dispatch
} from 'react';
import { Link } from 'react-router-dom';
import { getHomeNewProducts } from '../services/getHomeNewProducts.ts';
import NewProduct from './NewProduct.tsx';
import { type NewProductType } from './types.ts';
import HeroImage from '../assets/images/innovative-tech.jpg';


const Main = (
  { setIsBtnVisible }:
  { setIsBtnVisible: Dispatch<SetStateAction<boolean>> }
) => {
  const [ haveNewProducts, setHaveNewProducts ] = useState(false);
  const [ newProducts, setNewProducts ] = useState<NewProductType[]>([]);

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
      <div className="hero-wrapper">
        <img className="hero-img" src={HeroImage} alt="A highly tech background" />
        <h1 className="title">
          Future is here! Explore latest tech with smartest prices.
        </h1>
      </div>
      
      {haveNewProducts && <div className="new-section">
        <h2 className="new-section_title">What's New?</h2>

        <div className="new-section-grid-wrapper">
          <div className="new-section-grid">
            {newProducts.map(item => {
              const imgSrc = new URL(`../assets/images/${item.img}`, import.meta.url).href;
              const encodedQuery = item.title.replaceAll(' ', '-');
              return (
                <NewProduct
                  key={item.id}
                  setIsBtnVisible={setIsBtnVisible}
                  item={item} 
                  imgSrc={imgSrc} 
                  encodedQuery={encodedQuery} 
                />
              )
            })}
          </div>
        </div>
      </div>}

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
          <Link to="/register">
            <div className="join-img-wrapper">
              <img 
                className="join-img" 
                src={joinUsImg} 
                alt="A tech office with people working" />
              <p className="join-par">Join us</p>
              <p className="join-par-sec">Cheaper Gear - 25% off when you join!</p>
            </div>
          </Link>
        </div>



      </main>
    </>
  );
};

export default Main;