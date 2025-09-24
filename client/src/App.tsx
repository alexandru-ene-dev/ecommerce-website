import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import BackToTop from './components/BackToTop.tsx';
import { useThemeContext } from './hooks/useThemeContext.ts';
import { useAuthContext } from './hooks/useAuthContext.ts';
import { getLocalFavorites } from './utils/localFavorites.ts';

import { getCart } from './utils/cartStorage.ts';
import useCartContext from './hooks/useCartContext.ts';
import { useAvatar } from './context/AuthContext/AvatarContext.tsx';
import useFavoritesContext from './hooks/useFavoritesContext.ts';
import type { Theme, ThemeIcon } from './context/types.ts';

import './styles/index.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import initializeAuth from './services/initializeAuth.tsx';
import ScrollToHash from './components/ScrollToHash.tsx';


const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const Homepage = lazy(() =>import('./pages/Homepage.tsx'));
const Register = lazy(() => import('./pages/RegisterPage.tsx'));
const Favorites = lazy(() => import('./pages/Favorites.tsx'));
const Cart = lazy(() => import('./pages/Cart.tsx'));
const About = lazy(() => import('./pages/About.tsx'));

const Profile = lazy(() => import('./pages/Profile.tsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.tsx'));
const Goodbye = lazy(() => import('./pages/Goodbye.tsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.tsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.tsx'));

const LoaderLine = lazy(() => import('./components/LoaderLine.tsx'));
const HandlePadding = lazy(() => import('./components/HandlePadding.tsx'));
const ScrollTop = lazy(() => import('./components/ScrollTop.tsx'));


function App() {
  const { state, dispatch: authDispatch } = useAuthContext();
  const { setLocalCart } = useCartContext();
  const { setAvatar } = useAvatar();
  const { setLocalFavorites } = useFavoritesContext();

  const { dispatch: themeDispatch } = useThemeContext();
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

    if (state?.user?.theme) {
      localStorage.setItem('theme', state.user.theme);
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
      try {
        const result = await initializeAuth();
        if (!result.success) return;
  
        authDispatch({ type: 'LOGIN', payload: result.user });
      } catch (err) {
        return {
          success: false,
          message: err
        }
      }
    };
    
    auth();
  }, [state.isLoggedIn]);


  useEffect(() => {
    const getAvatar = async () => {
      if (!state.isLoggedIn || !state.user?._id || !state.user?.avatar) {
        return;
      }

      try {
        const { getAvatarService } = await import('./services/getAvatarService.tsx');
        const result = await getAvatarService(state.user._id);

        if (result?.success && result.avatar) {
          setAvatar(`data:image/png;base64,${result.avatar}`);
        } else {
          setAvatar(null);
        }
      } catch (err) {
        setAvatar(null);
      }
    };

    getAvatar();
  }, [state.isLoggedIn, state?.user?._id]);
  

  return (
    <>
      <ScrollToHash />
      <Header />
      
      <Suspense fallback={<div>Loading...</div>}>
        <ScrollTop />
        <LoaderLine />
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
          <Route path='/login' element={<LoginPage />} />
          
          <Route path='/products/:name' element={
            <ProductPage 
            setIsBtnVisible={setIsBtnVisible} 
            setStickyBtnHeight={setStickyBtnHeight}  
            />
          }/>

          <Route path='/search' element={<SearchPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/goodbye' element={<Goodbye />} />
          <Route path='/categories/:subcategory/:subSubcategory?' element={<CategoryPage />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>

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
