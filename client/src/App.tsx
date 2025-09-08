import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import BackToTop from './components/BackToTop.tsx';
import { ScrollTop } from './components/ScrollTop.tsx';
import { useInputContext } from './hooks/useInputContext.ts';

import { HandlePadding } from './components/HandlePadding.tsx';
import NotFound from './pages/NotFound.tsx';
import Homepage from './pages/Homepage.tsx';
import Register from './pages/RegisterPage.tsx';
import Favorites from './pages/Favorites.tsx';

import Cart from './pages/Cart.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Profile from './pages/Profile.tsx';
import ProductPage from './pages/ProductPage.tsx';

import { useAuthContext } from './hooks/useAuthContext.ts';
import { getLocalFavorites } from './utils/localFavorites.ts';
import CategoryPage from './pages/CategoryPage.tsx';
import LoaderLine from './components/LoaderLine.tsx';
import { getCart } from './utils/cartStorage.ts';

import useCartContext from './hooks/useCartContext.ts';
import { getAvatarService } from './services/getAvatarService.tsx';
import { useAvatar } from './context/AuthContext/AvatarContext.tsx';
import useFavoritesContext from './hooks/useFavoritesContext.ts';

import './styles/index.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import initializeAuth from './services/initializeAuth.tsx';


function App() {
  const { state, dispatch: authDispatch } = useAuthContext();
  const { setLocalCart } = useCartContext();
  const { setAvatar } = useAvatar();
  const { setLocalFavorites } = useFavoritesContext();

  const { dispatch: themeDispatch } = useInputContext();
  // sticky button on product page
  const [ isBtnVisible, setIsBtnVisible ] = useState(false);
  const [ stickyBtnHeight, setStickyBtnHeight ] = useState(30);


  useEffect(() => {
    const theme = state?.user?.theme || localStorage.getItem('theme');

    if (theme !== null) {
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('os-default');
      document.body.classList.remove('light-mode');
      document.body.classList.add(theme);

      switch (theme) {
        case 'dark-mode': 
          themeDispatch({ type: 'TOGGLE_THEME', theme: 'dark-mode', themeIcon: 'dark_mode' });
          break;
        case 'light-mode':
          themeDispatch({ type: 'TOGGLE_THEME', theme: 'light-mode', themeIcon: 'light_mode' });
          break;
        case 'os-default-mode':
          themeDispatch({ type: 'TOGGLE_THEME', theme: 'os-default', themeIcon: 'contrast' });
          break;
      }
    }
  }, [state.isLoggedIn, state?.user?.theme]);


  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const favs = getLocalFavorites();
        setLocalFavorites(favs);
      }
    }

    if (state.user) {
      const safeFav = Array.isArray(state.user.favorites) ? state.user.favorites : [];
      setLocalFavorites(safeFav);
      return;
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [state.isLoggedIn]);


  useEffect(() => {
    const handleCartStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const cart = getCart();
        setLocalCart(cart);
        return;
      }
    }
      
    if (state.user) {
      const safeCart = Array.isArray(state.user.cart) ? state.user.cart : [];
      setLocalCart(safeCart);
      return;
    }

    window.addEventListener('storage', handleCartStorage);
    return () => window.removeEventListener('storage', handleCartStorage);
  }, [state.isLoggedIn]);


  // initialize auth
  useEffect(() => {
    const auth = async () => {
      const result = await initializeAuth();
      if (!result.success) return;

      authDispatch({ type: 'LOGIN', payload: result.user });
    };
    
    auth();
  }, [state.isLoggedIn]);


  useEffect(() => {
    const getAvatar = async () => {
      if (!state.isLoggedIn) {
        return;
      }

      try {
        if (!state.user) return;
        const avatar = await getAvatarService(state.user._id);

        if (avatar.success === false) {
          console.error(avatar?.message);
          return;
        }

        setAvatar(`data:image/png;base64,${avatar.avatar}`);
      } catch (err) {
        console.error(err);
      }
    };

    getAvatar();
  }, [state.isLoggedIn]);
  

  return (
    <>
      <LoaderLine />
      <Header />
      <ScrollTop />
      <HandlePadding 
        setStickyBtnHeight={setStickyBtnHeight}
        setIsBtnVisible={setIsBtnVisible}
      />
      
      <Routes>
        <Route path='/' element={
          <Homepage setIsBtnVisible={setIsBtnVisible} />
        }/>
        <Route path='/register' element={<Register />} />
        <Route path='/favorites' element={<Favorites />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        
        <Route path='/products/:name' element={
          <ProductPage 
            isBtnVisible={isBtnVisible} 
            setIsBtnVisible={setIsBtnVisible} 
            stickyBtnHeight={stickyBtnHeight} 
            setStickyBtnHeight={setStickyBtnHeight}  
          />
        }/>

        <Route path='/profile' element={<Profile />} />
        <Route path='/categories/:subcategory/:subSubcategory?' element={<CategoryPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <BackToTop />

      <Footer 
        isBtnVisible={isBtnVisible} 
        stickyBtnHeight={stickyBtnHeight} 
        setStickyBtnHeight={setStickyBtnHeight}  
      />
    </>
  )
}

export default App
