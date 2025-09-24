import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import NewProduct from '../components/NewProduct.tsx';
import { type NewProductType } from '../components/types.ts';
import CartFavoritesFeedback from '../components/CartFavoritesFeedback.tsx';

import HeroImage from '../images/innovative-tech.webp';
import useLoadingContext from '../hooks/useLoadingContext.ts';
import delay from '../utils/delay.ts';
import { useAuthContext } from '../hooks/useAuthContext.ts';
import LazyProductImage from '../components/LazyProductImage.tsx';


const RecentlyViewed = lazy(() => import('../components/RecentlyViewed.tsx'));
const Deals = lazy(() => import('../components/Deals.tsx'));


export type ActiveFeedback = {
  value: 'Cart' | 'Favorites',
  action: 'add' | 'remove'
};


const Homepage = () => {
  const { setLoading } = useLoadingContext();
  const [ haveNewProducts, setHaveNewProducts ] = useState(false);
  const [ newProducts, setNewProducts ] = useState<NewProductType[]>([]);

  const { state } = useAuthContext();
  const [ feedbackArray, setFeedbackArray ] = useState<ActiveFeedback[] | []>([]);
  const [ _, setActiveFeedback ] = useState<ActiveFeedback | null>(null);

  const newProductElements = newProducts.map(item => {
    const encodedQuery = item.title.replaceAll(' ', '-');
    
    return (
      <NewProduct
        setFeedbackArray={setFeedbackArray}
        setActiveFeedback={setActiveFeedback}
        key={item.id}
        item={item} 
        encodedQuery={encodedQuery} 
      />
    );
  });


  useEffect(() => {
    const getProducts = async () => {
      const { getHomeNewProducts } = await import('../services/getHomeNewProducts.ts');
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
      { feedbackArray.length > 0 &&
        <ul aria-live="polite" className="cart-favorites-feedback">
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

      <Suspense>
        <Deals />
      </Suspense>

      <div className="join-wrapper">
        <h2 className="section_title">Join us now</h2>
        <Link
          aria-label={state.isLoggedIn? 'See all products' : 'Go to register page'} 
          onClick={async () => {
            setLoading(true);
            await delay(700);
            setLoading(false);
          }} 
          to={state.isLoggedIn? "/categories/all" : "/register"}
        >
          <div className="join-img-wrapper">
            <LazyProductImage 
              imageName="join-us.jpg" 
              alt="A tech office with people working"
              className="join-img" 
            />

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

      <Suspense>
        <RecentlyViewed 
          setFeedbackArray={setFeedbackArray}
          setActiveFeedback={setActiveFeedback}
        />
      </Suspense>

    </main>
  );
};

export default Homepage;