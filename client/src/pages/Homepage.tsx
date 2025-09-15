import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeNewProducts } from '../services/getHomeNewProducts.ts';
import NewProduct from '../components/NewProduct.tsx';
import { type NewProductType } from '../components/types.ts';

import HeroImage from '../assets/images/innovative-tech.jpg';
import useLoadingContext from '../hooks/useLoadingContext.ts';
import delay from '../utils/delay.ts';
import RecentlyViewed from '../components/RecentlyViewed.tsx';
import Deals from '../components/Deals.tsx';
import { useAuthContext } from '../hooks/useAuthContext.ts';


const Homepage = () => {
  const { setLoading } = useLoadingContext();
  const [ haveNewProducts, setHaveNewProducts ] = useState(false);
  const [ newProducts, setNewProducts ] = useState<NewProductType[]>([]);
  const joinUsImg = new URL('../assets/images/join-us.jpg', import.meta.url).href;
  const { state } = useAuthContext();

  const newProductElements = newProducts.map(item => {
    const imgSrc = new URL(`../assets/images/${item.img}`, import.meta.url).href;
    const encodedQuery = item.title.replaceAll(' ', '-');
    
    return (
      <NewProduct
        key={item.id}
        item={item} 
        imgSrc={imgSrc} 
        encodedQuery={encodedQuery} 
      />
    );
  });

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
    <main>
      <div className="hero-wrapper">
        <img className="hero-img" src={HeroImage} alt="A highly tech background" />
        <h1 className="title">
          Future is here! Explore latest tech with smartest prices.
        </h1>
      </div>
    
      {haveNewProducts && 
        <div id="new" className="new-section">
          <h2 className="section_title">What's New?</h2>

          <div className="new-section-grid-wrapper">
            <div className="new-section-grid">
              {newProductElements}
            </div>
          </div>
        </div>
      }

      <Deals />

      <div className="join-wrapper">
        <Link 
          onClick={async () => {
            setLoading(true);
            await delay(700);
            setLoading(false);
          }} 
          to={state.isLoggedIn? "/categories/all" : "/register"}
        >
          <div className="join-img-wrapper">
            <img 
              className="join-img" 
              src={joinUsImg} 
              alt="A tech office with people working" />

            <p className="join-par">{state.isLoggedIn? "Congrats!" : "Join us"}</p>

            <p className="join-par-sec">
              {state.isLoggedIn? 
                "Your gear just got cheaper - enjoy 5% off all products!" :
                "Upgrade your gear now! Get 5% off when you join on all products!"
              }
            </p>
          </div>
        </Link>
      </div>

      <RecentlyViewed />

    </main>
  );
};

export default Homepage;