import DesktopMenu from "./DesktopMenu";
import { Link } from 'react-router-dom';
import { type ChangeEvent, useContext } from 'react';
import type { DesktopHeaderType } from "./types";
import ThemeSwitcher from "./ThemeSwitcher";
import { FavoritesContext } from "../context/FavoritesContext";


const DesktopHeader = (
  {
    submitSearch,
    toggleLoginMenu,
    toggleThemeMenu,
    visibleThemeMenu,
    themeIcon,
    changeTheme,
    searchInput,
    setSearchInput
  }: DesktopHeaderType
) => {

  
  const favContext = useContext(FavoritesContext);
  if (!favContext) {
    throw new Error('FavoritesContext must be used inside a <Provider />');
  }
  const { localFavorites } = favContext;


  return (
    <>  
      <div className="desktop-header">
        <nav className="navigation">
          <div className="top-navigation">
            <Link onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="logo" to='/'>
              Pr
              <span className="material-symbols-outlined cog-icon">settings</span>
              gressio
            </Link>

            <search className="search-wrapper">
              <form onSubmit={submitSearch} className="search-form">
                <input 
                  className="input search-input"
                  onChange={
                    (e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)
                  } 
                  type="search"
                  placeholder="Search"
                  value={searchInput}
                />

                <button className="search-btn">
                  <span className="material-symbols-outlined search-icon">search</span>
                </button>
              </form>
            </search>

            <div className="header-btns">
              <button onClick={toggleLoginMenu} className="account-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">account_circle</span>
              </button>

              <Link to="/favorites" className="cart-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">
                  favorite
                  {localFavorites.length > 0 && 
                  <span className="fav-count">{localFavorites.length}</span>}
                </span>
              </Link>

              <Link to="/cart" className="fav-btn header-btn">
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
          
          <DesktopMenu />
          
        </nav>
      </div>
    </>
  );
};

export default DesktopHeader;