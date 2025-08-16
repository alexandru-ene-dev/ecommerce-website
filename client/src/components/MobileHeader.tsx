import { type ChangeEvent, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { type MobileHeaderType } from './types';
import ThemeSwitcher from './ThemeSwitcher';
import { FavoritesContext } from '../context/FavoritesContext';


const MobileHeader = (
  {
    visibleMenu,
    showMenu,
    submitSearch,
    toggleLoginMenu,
    toggleThemeMenu,
    visibleThemeMenu,
    themeIcon,
    changeTheme,
    searchInput,
    setSearchInput,
    closeModal,
  }: MobileHeaderType
) => {
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a <Provider />');
  }
  const { localFavorites } = favContext;


  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeModal();
  };


  return (
    <div className="mobile-header">
      <nav className="navigation">
        <div className="mobile-nav-wrapper">
          <button 
            data-closed-icon={visibleMenu? 'true' : 'false'} 
            ref={hamburgerBtnRef} 
            className="hamburger-btn" 
            onClick={showMenu}
          >
            <div className="hamburger">
              <span className="hamburger-line ham-line1"></span>
              <span className="hamburger-line ham-line2"></span>
              <span className="hamburger-line ham-line3"></span>
            </div>
          </button>

          <Link onClick={goToTop} to="/" className="logo">
            Pr
              <span className="material-symbols-outlined cog-icon">settings</span>
            gressio
          </Link>

          <div className="header-btns">
            <button onClick={toggleLoginMenu} className="account-btn header-btn">
              <span className="material-symbols-outlined header-btn-icon">account_circle</span>
            </button>

            <Link onClick={closeModal} to="/favorites" className="fav-btn header-btn">
              <span className="material-symbols-outlined header-btn-icon">
                favorite
                {localFavorites.length > 0 && 
                  <span className="fav-count">{localFavorites.length}</span>}
              </span>
            </Link>

            <Link onClick={closeModal} to="/cart" className="cart-btn header-btn">
              <span className="material-symbols-outlined header-btn-icon">shopping_cart</span>
            </Link>

            <ThemeSwitcher
              toggleThemeMenu={toggleThemeMenu}
              visibleThemeMenu={visibleThemeMenu}
              themeIcon={themeIcon}
              changeTheme={changeTheme}
            />
          </div>
        </div>

        <search className="search-wrapper">
          <form onSubmit={submitSearch} className="search-form">
            <input 
              className="input search-input"
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} 
              type="search"
              placeholder="Search"
              value={searchInput}
            />

            <button className="search-btn">
              <span className="material-symbols-outlined search-icon">search</span>
            </button>
          </form>
        </search>

      </nav>
    </div>
  );
};

export default MobileHeader;