import Header from './components/Header.tsx';
import Menu from './components/Menu.tsx';
import Footer from './components/Footer.tsx';
import BackToTop from './components/BackToTop.tsx';
import Login from './components/Login';

import { ScrollTop } from './components/ScrollTop.tsx';
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
import { useMenuContext } from './hooks/useMenuContext.ts';
import './styles/index.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState, type MouseEvent, useContext } from 'react';

import initializeAuth from './services/initializeAuth.tsx';
import { useAuthContext } from './hooks/useAuthContext.ts';
import { getLocalFavorites } from './utils/localFavorites.ts';
import { FavoritesContext } from './context/FavoritesContext.tsx';
import CategoryPage from './pages/CategoryPage.tsx';

import LoaderLine from './components/LoaderLine.tsx';
import { getCart } from './utils/cartStorage.ts';
import useCartContext from './hooks/useCartContext.ts';
import { BackdropModal } from './components/BackdropModal.tsx';


function App() {
  const { dispatch: menuDispatch } = useMenuContext();
  const { state, dispatch: authDispatch } = useAuthContext();
  const [ visibleMenu, setVisibleMenu ] = useState(false);
  const [ visibleLoginMenu, setVisibleLoginMenu ] = useState(false);
  const [ shouldRenderLogin, setShouldRender ] = useState(false);


  const { setLocalCart } = useCartContext();
  

  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a <Provider />');
  }
  const { setLocalFavorites } = favContext;


  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const favs = getLocalFavorites();
        setLocalFavorites(favs);
      }
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);


  useEffect(() => {
    const handleCartStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const cart = getCart();
        setLocalCart(cart);
      }
    }

    window.addEventListener('storage', handleCartStorage);
    return () => window.removeEventListener('storage', handleCartStorage);
  }, []);


  // sticky button on product page
  const [ isBtnVisible, setIsBtnVisible ] = useState(false);
  const [ stickyBtnHeight, setStickyBtnHeight ] = useState(30);

  
  // initialize auth
  useEffect(() => {
    const auth = async () => {
      const result = await initializeAuth();
      if (!result.success) return;

      authDispatch({ type: 'LOGIN', payload: result.user });
    };

    auth();
  }, [state]);
  

  useEffect(() => {
    if (visibleLoginMenu) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [visibleLoginMenu]);


  const closeLoginMenu = () => {
    setVisibleLoginMenu(false);
  };
  

  const showMenu = (e: MouseEvent) => {
    const show = !visibleMenu;
    setVisibleMenu(show);

    if (!show) {
      menuDispatch({ type: 'SET_VIEW', payload: 'menu' });
      menuDispatch({ type: 'SET_CATEGORY', payload: null });
    }

    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    closeLoginMenu();

    return !visibleMenu?
      target.dataset.closedIcon = 'true' : target.dataset.closeIcon = 'false';
  };


  const closeModal = () => {
    setVisibleMenu(false);
    menuDispatch({ type: 'SET_VIEW', payload: 'menu' });
    menuDispatch({ type: 'SET_CATEGORY', payload: null });
  }


  const toggleLoginMenu = () => {
    const show = !visibleLoginMenu;
    setVisibleLoginMenu(show);
    closeModal();
  };


  useEffect(() => {
    const handleBodyClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        target.classList.contains('modal') ||
        target.classList.contains('mobile-nav-wrapper') ||
        target.classList.contains('search-btn') ||
        target.classList.contains('search-icon') ||
        target.tagName === 'NAV' ||
        target.tagName === 'HEADER' ||
        target.tagName === 'FORM' ||
        target.tagName === 'INPUT'
      ) {
        closeModal();
        menuDispatch({ type: 'SET_VIEW', payload: 'menu' });
        menuDispatch({ type: 'SET_CATEGORY', payload: null });
      }
    };

    document.addEventListener('click', handleBodyClick);
    return () => {
      document.removeEventListener('click', handleBodyClick);
    }
  }, []);


  return (
    <>
      {/* <BackdropModal /> */}

      <LoaderLine />
      <Header 
        visibleMenu={visibleMenu} 
        showMenu={showMenu} 
        closeModal={closeModal}
        toggleLoginMenu={toggleLoginMenu}
      />

      {shouldRenderLogin && 
        <Login 
          visibleLoginMenu={visibleLoginMenu} 
          closeLoginMenu={closeLoginMenu} 
        />}

      <Menu visibleMenu={visibleMenu} closeModal={closeModal} />
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
        setIsBtnVisible={setIsBtnVisible} 
        stickyBtnHeight={stickyBtnHeight} 
        setStickyBtnHeight={setStickyBtnHeight}  
      />
    </>
  )
}

export default App
