import { useInputContext } from '../hooks/useInputContext.ts';
import { useState, useEffect, useRef } from 'react'; 
import StickySaleText from './StickySaleText.tsx';
import { changeThemeService } from '../services/changeThemeService.ts';
import SearchBar from './SearchBar.tsx';

import { useAuthContext } from '../hooks/useAuthContext.ts';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher.tsx';
import useLoadingContext from '../hooks/useLoadingContext.ts';

import delay from '../utils/delay.ts';
import useIsMobile from '../hooks/useIsMobile.ts';
import DesktopMenu from './DesktopMenu.tsx';
import MobileMenu from './MobileMenu.tsx';

import FavoritesMenu from './FavoritesMenu.tsx';
import Login from './Login.tsx';
import CartMenu from './CartMenu.tsx';
import { useMenuContext } from '../hooks/useMenuContext.ts';


const Header = () => {
  const [ visibleHeader, setVisibleHeader ] = useState(true);
  const [ visibleThemeMenu, setThemeMenu ] = useState(false);
  const [ lastScroll, setLastScroll ] = useState(0);
  const { dispatch } = useInputContext();
  const { state } = useAuthContext();

  const { setLoading } = useLoadingContext();
  const [ showAccount, setShowAccount ] = useState(false);
  const [ visibleMobileMenu, setVisibleMobileMenu ] = useState(false);
  const { dispatch: menuDispatch } = useMenuContext();
  const { state: themeState } = useInputContext();
  
  const isMobile = useIsMobile();
  const [ isFavoritesHovered, setIsFavoritesHovered ] = useState(false);
  const [ visibleLoginMenu, setVisibleLoginMenu ] = useState(false);
  const [ isCartHovered, setIsCartHovered ] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const cartRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);


  const handleReload = async () => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeModal();
    
    await delay(500);
    setLoading(false);
  };


  const changeTheme = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    if (target.dataset.theme === 'os') {
      document.body.classList.remove('light-mode');
      document.body.classList.remove('dark-mode');

      dispatch({ type: 'TOGGLE_THEME', theme: 'os-default', themeIcon: 'contrast' });
      if (state.user) {
        changeThemeService(state.user._id, 'os-default');
        return;
      }
      localStorage.setItem('theme', 'os_default');

    } else if (target.dataset.theme === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');

      dispatch({ type: 'TOGGLE_THEME', theme: 'light-mode', themeIcon: 'light_mode' });
      if (state.user) {
        changeThemeService(state.user._id, 'light-mode');
        return;
      }
      localStorage.setItem('theme', 'light-mode');

    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');

      dispatch({ type: 'TOGGLE_THEME', theme: 'dark-mode', themeIcon: 'dark_mode' });
      if (state.user) {
        changeThemeService(state.user._id, 'dark-mode');
        return;
      }
      localStorage.setItem('theme', 'dark-mode');
    }
  };


  const closeModal = () => {
    setVisibleMobileMenu(false);
    menuDispatch({ type: 'SET_VIEW', payload: 'menu' });
    menuDispatch({ type: 'SET_CATEGORY', payload: null });
  }


  useEffect(() => {
    const toggleVisibleHeader = () => {
      const currentScroll = window.scrollY;

      if (currentScroll === 0) {
        setVisibleHeader(true);
      } else if (
        (currentScroll > lastScroll) &&
        (
          !visibleLoginMenu && 
          !visibleThemeMenu && 
          !isFavoritesHovered && 
          !isCartHovered &&
          !visibleMobileMenu
        )
      ) {
        setVisibleHeader(false);
      } else {
        setVisibleHeader(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', toggleVisibleHeader);
    return () => window.removeEventListener('scroll', toggleVisibleHeader);
  }, [lastScroll]);


  const handleMenus = (menu: string) => {
    if (menu !== 'cart') setIsCartHovered(false);
    if (menu !== 'favorites') setIsFavoritesHovered(false);
    if (menu !== 'login') setVisibleLoginMenu(false);

    if (menu !== 'theme') setThemeMenu(false);
    if (menu !== 'mobileMenu') setVisibleMobileMenu(false);
    setActiveMenu(prev => (prev === menu ? null : menu));

    if (menu === '') {
      setActiveMenu(null);
    }

    switch (menu) {
      case 'theme':
        setThemeMenu(prev => !prev);
        break;
      case 'login':
        setVisibleLoginMenu(prev => !prev);
        break;
      case 'favorites':
        setIsFavoritesHovered(prev => !prev);
        break;
      case 'cart':
        setIsCartHovered(prev => !prev);
        break;
      case 'mobileMenu':
        setVisibleMobileMenu(prev => !prev);
        break;
    }
  };


  useEffect(() => {
    const handleOutsideMenuClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const backdrop = target.classList.contains('modal');

      if (
        !cartRef.current?.contains(event.target as Node) &&
        !favoritesRef.current?.contains(event.target as Node) &&
        !loginRef.current?.contains(event.target as Node) &&
        !themeRef.current?.contains(event.target as Node) &&
        (!mobileMenuRef.current?.contains(event.target as Node) || backdrop)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleOutsideMenuClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideMenuClick);
    };
  }, []);


  const closeAllMenus = () => {
    setIsCartHovered(false);
    setIsFavoritesHovered(false);
    setVisibleLoginMenu(false);
    setThemeMenu(false);
    setVisibleMobileMenu(false);
    setActiveMenu(null);
  };


  return (
    <header className="header" data-visible={visibleHeader? "true" : "false"}>
      <nav className="navigation">
        <div className="mobile-nav-wrapper">

          {isMobile &&
            <MobileMenu
              ref={mobileMenuRef}
              handleMenus={handleMenus} 
              visibleMobileMenu={visibleMobileMenu} 
              closeModal={closeModal} 
            />
          }

          <Link onClick={handleReload} to="/" className="logo">
            Pr
              <span className="material-symbols-outlined cog-icon">settings</span>
            gressio
          </Link>

          {/* Desktop Search Bar */}
          {!isMobile && <SearchBar />}

          <div className="header-btns">
            <Login
              ref={loginRef}
              handleMenus={handleMenus}
              visibleLoginMenu={visibleLoginMenu}
              setVisibleLoginMenu={setVisibleLoginMenu}
              showAccount={showAccount} 
              setShowAccount={setShowAccount}
              activeMenu={activeMenu} 
            />

            <FavoritesMenu
              ref={favoritesRef}
              handleMenus={handleMenus} 
              closeModal={closeModal}
              isFavoritesHovered={isFavoritesHovered}
              setIsFavoritesHovered={setIsFavoritesHovered} 
            />

            <CartMenu
              ref={cartRef}
              handleMenus={handleMenus}
              closeModal={closeModal}
              isCartHovered={isCartHovered}
              setIsCartHovered={setIsCartHovered}
            />
  
            <ThemeSwitcher
              ref={themeRef}
              handleMenus={handleMenus}
              visibleThemeMenu={visibleThemeMenu}
              themeIcon={themeState.themeIcon}
              changeTheme={changeTheme}
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobile && <SearchBar />}

        {!isMobile && <DesktopMenu />}
      </nav>

      <StickySaleText />
    </header>
  )
}

export default Header;