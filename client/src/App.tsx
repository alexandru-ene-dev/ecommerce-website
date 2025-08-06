import Header from './components/Header.tsx';
import Menu from './components/Menu.tsx';
import Footer from './components/Footer.tsx';
import BackToTop from './components/BackToTop.tsx';
import NotFound from './pages/NotFound.tsx';
import Homepage from './pages/Homepage.tsx';
import Register from './pages/RegisterPage.tsx';
import Favorites from './pages/Favorites.tsx';
import Cart from './pages/Cart.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Login from './components/Login';
import Profile from './pages/Profile.tsx';
import ProductPage from './pages/ProductPage.tsx';
import { useMenuContext } from './hooks/useMenuContext.ts';
import { ScrollTop } from './components/ScrollTop.tsx';
import './styles/index.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState, type MouseEvent } from 'react';


function App() {
  const { state, dispatch } = useMenuContext();
  const [ visibleMenu, setVisibleMenu ] = useState(false);
  const [ visibleLoginMenu, setVisibleLoginMenu ] = useState(false);
  const [ shouldRenderLogin, setShouldRender ] = useState(false);
  
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
      dispatch({ type: 'SET_VIEW', payload: 'menu' });
      dispatch({ type: 'SET_CATEGORY', payload: null });
    }

    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    closeLoginMenu();

    return !visibleMenu?
      target.dataset.closedIcon = 'true' : target.dataset.closeIcon = 'false';
  };

  const closeModal = () => {
    setVisibleMenu(false);
    dispatch({ type: 'SET_VIEW', payload: 'menu' });
    dispatch({ type: 'SET_CATEGORY', payload: null });
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
        dispatch({ type: 'SET_VIEW', payload: 'menu' });
        dispatch({ type: 'SET_CATEGORY', payload: null });
      }
    };

    document.addEventListener('click', handleBodyClick);
    return () => {
      document.removeEventListener('click', handleBodyClick);
    }
  }, []);


  return (
    <>
      <Header 
        visibleMenu={visibleMenu} 
        showMenu={showMenu} 
        closeModal={closeModal}
        visibleLoginMenu={visibleLoginMenu}
        toggleLoginMenu={toggleLoginMenu}
      />

      {shouldRenderLogin && 
        <Login 
          visibleLoginMenu={visibleLoginMenu} 
          closeLoginMenu={closeLoginMenu} 
        />}

      <Menu visibleMenu={visibleMenu} closeModal={closeModal} />
      <ScrollTop />
      
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/products/:name' element={<ProductPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      <BackToTop />
      <Footer />
    </>
  )
}

export default App
