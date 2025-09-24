import { useThemeContext } from '../hooks/useThemeContext.ts';
import { useState, useEffect, useRef, lazy, Suspense } from 'react'; 
import StickySaleText from './StickySaleText.tsx';
import { changeThemeService } from '../services/changeThemeService.ts';
import SearchBar from './SearchBar.tsx';

import { useAuthContext } from '../hooks/useAuthContext.ts';
import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher.tsx';
import useLoadingContext from '../hooks/useLoadingContext.ts';
import type { Theme, ThemeIcon } from '../context/types.ts';

import delay from '../utils/delay.ts';
import useIsMobile from '../hooks/useIsMobile.ts';
import MobileMenu from './MobileMenu.tsx';
import Login from './Login.tsx';
import { useMenuContext } from '../hooks/useMenuContext.ts';
import CogIcon from '../images/icons/cog-icon.svg?component';


const CartMenu = lazy(() => import('./CartMenu.tsx'));
const FavoritesMenu = lazy(() => import('./FavoritesMenu.tsx'));
const DesktopMenu = lazy(() => import('./DesktopMenu.tsx'));


const Header = () => {
  const [ visibleHeader, setVisibleHeader ] = useState(true);
  const [ visibleThemeMenu, setThemeMenu ] = useState(false);
  const [ lastScroll, setLastScroll ] = useState(0);
  const { state } = useAuthContext();
  const { setLoading } = useLoadingContext();

  const [ visibleMobileMenu, setVisibleMobileMenu ] = useState(false);
  const { dispatch: menuDispatch } = useMenuContext();
  const { state: themeState, dispatch } = useThemeContext();
  const isMobile = useIsMobile();
  const [ isFavoritesHovered, setIsFavoritesHovered ] = useState(false);

  const [ visibleLoginMenu, setVisibleLoginMenu ] = useState(false);
  const [ isCartHovered, setIsCartHovered ] = useState(false);
  const [ _, setActiveMenu ] = useState<string | null>(null);
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);

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

    const theme = target.dataset.theme as Theme;

    if (theme === 'os-default') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const newTheme = prefersDark ? 'dark-mode' : 'light-mode';
      document.documentElement.className = newTheme;
    } else {
      document.documentElement.className = theme;
    }

    dispatch({ 
      type: 'TOGGLE_THEME', 
      theme: theme, 
      themeIcon: (theme === 'os-default'? 'contrast' : theme.replace('-', '_')) as ThemeIcon
    });

    if (state.user) {
      changeThemeService(state.user._id, theme);
    }
    
    localStorage.setItem('theme', theme);
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
          !visibleMobileMenu &&
          activeIndex === null
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
    closeModal();
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

          <Link 
            aria-label="Progressio Logo - Go to Homepage" 
            onClick={handleReload} 
            to="/" 
            className="logo"
          >
            Pro
            <CogIcon className="cog-icon"/>
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
            />

            <Suspense>
              <FavoritesMenu
                ref={favoritesRef}
                handleMenus={handleMenus} 
                closeModal={closeModal}
                isFavoritesHovered={isFavoritesHovered}
                setIsFavoritesHovered={setIsFavoritesHovered} 
              />
            </Suspense>

            <Suspense>
              <CartMenu
                ref={cartRef}
                handleMenus={handleMenus}
                closeModal={closeModal}
                isCartHovered={isCartHovered}
                setIsCartHovered={setIsCartHovered}
              />
            </Suspense>
  
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

        <Suspense>
          {!isMobile && 
            <DesktopMenu
              setVisibleHeader={setVisibleHeader}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          }
        </Suspense>
      </nav>

      <StickySaleText />
    </header>
  )
}

export default Header;