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
import type { Theme, ThemeIcon } from './context/types.ts';

import './styles/index.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import initializeAuth from './services/initializeAuth.tsx';
import SearchPage from './pages/SearchPage.tsx';
import ScrollToHash from './components/ScrollToHash.tsx';


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
    const theme = (state?.user?.theme || localStorage.getItem('theme') || 'os-default') as Theme;

    if (theme === 'os-default') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystemTheme = () => {
        const newTheme = prefersDark.matches ? 'dark-mode' : 'light-mode';
        document.documentElement.className = newTheme;
      };

      applySystemTheme();

      prefersDark.addEventListener('change', applySystemTheme);
      return () => prefersDark.removeEventListener('change', applySystemTheme);
    } else {
      document.documentElement.className = theme;
    }

    themeDispatch({ 
      type: 'TOGGLE_THEME', 
      theme: theme, 
      themeIcon: (theme as Theme === 'os-default'? 'contrast' : theme.replace('-', '_')) as ThemeIcon
    });
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
          return;
        }

        setAvatar(`data:image/png;base64,${avatar.avatar}`);
      } catch (err) {
        return;
      }
    };

    getAvatar();
  }, [state.isLoggedIn, state?.user?._id]);
  

  return (
    <>
      <ScrollTop />
      <ScrollToHash />
      <LoaderLine />
      <Header />
      <HandlePadding 
        setStickyBtnHeight={setStickyBtnHeight}
        setIsBtnVisible={setIsBtnVisible}
      />
      
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/favorites' element={<Favorites />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        
        <Route path='/products/:name' element={
          <ProductPage 
            setIsBtnVisible={setIsBtnVisible} 
            setStickyBtnHeight={setStickyBtnHeight}  
          />
        }/>

        <Route path='/search' element={<SearchPage />} />
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
