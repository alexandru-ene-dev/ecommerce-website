import { Link } from 'react-router-dom';
import { useInputContext } from '../hooks/useInputContext';
import { 
  type ChangeEvent, 
  type MouseEvent, 
  useState, 
  useEffect, 
  useRef 
} from 'react'; 
import DesktopMenu from './DesktopMenu';

const Header = (
  { showMenu, closeModal, visibleMenu, visibleLoginMenu, toggleLoginMenu }: { 
    showMenu: (e: MouseEvent) => void, 
    closeModal: () => void
    visibleMenu: boolean
    visibleLoginMenu: boolean
    toggleLoginMenu: () => void
  }) => {
  const [ visibleHeader, setVisibleHeader ] = useState(true);
  const [ visibleThemeMenu, setThemeMenu ] = useState(false);
  const [ themeIcon, setThemeIcon ] = useState('contrast');
  const [ lastScroll, setLastScroll ] = useState(0);
  const { state, dispatch } = useInputContext();
  const hamburgerBtnRef = useRef<HTMLButtonElement>(null);

  const submitSearch = (e: MouseEvent<HTMLFormElement>) => {
    if (e) e.preventDefault(); 
  };

  const toggleThemeMenu = (e: MouseEvent) => {
    e.stopPropagation();
    setThemeMenu(prev => !prev);
  }

  const changeTheme = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    if (!target) return;

    if (target.dataset.theme === 'os') {
      document.body.classList.remove('light-mode');
      document.body.classList.remove('dark-mode');
      dispatch({ type: 'TOGGLE_THEME', payload: 'os_default' });
      setThemeIcon('contrast');

    } else if (target.dataset.theme === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      dispatch({ type: 'TOGGLE_THEME', payload: 'light_theme' });
      setThemeIcon('light_mode');

    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      dispatch({ type: 'TOGGLE_THEME', payload: 'dark_theme' });
      setThemeIcon('dark_mode');
    }
  };


  useEffect(() => {
    const handleOutsideThemeClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        !target.closest('.theme-btn') && !target.closest('.theme-menu')
      ) {
        setThemeMenu(false);
      }
    };

    document.addEventListener('click', handleOutsideThemeClick);
    return () => document.removeEventListener('click', handleOutsideThemeClick);
  }, []);


  useEffect(() => {
    const toggleVisibleHeader = () => {
      const currentScroll = window.scrollY;

      if (currentScroll === 0) {
        setVisibleHeader(true);
      } else if (currentScroll > lastScroll) {
        setVisibleHeader(false);
      } else {
        setVisibleHeader(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', toggleVisibleHeader);

    return () => window.removeEventListener('scroll', toggleVisibleHeader);
  }, [lastScroll]);

  return (
    <>
      <header className="mobile-header" data-visible={visibleHeader? "true" : "false"}>
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

            <Link onClick={closeModal} to="/" className="logo">Progressio</Link>

            <div className="header-btns">
              <button onClick={toggleLoginMenu} className="account-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">account_circle</span>
              </button>

              <Link onClick={closeModal} to="/favorites" className="fav-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">favorite</span>
              </Link>

              <Link onClick={closeModal} to="/cart" className="cart-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">shopping_cart</span>
              </Link>

              <div onClick={toggleThemeMenu} className="theme-switcher">
                <button 
                  className="theme-switcher-btn header-btn" 
                  aria-haspopup="menu" 
                  aria-expanded={visibleThemeMenu? "true" : "false"
                }>
                  <span className="material-symbols-outlined header-btn-icon">{themeIcon}</span>
                </button>
                { visibleThemeMenu && <ul className="theme-list">
                  <li className="theme-item">
                    <button data-theme="os" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined theme-icon">contrast</span>
                      <span>OS</span>
                    </button>
                  </li>

                  <li className="theme-item">
                    <button data-theme="light" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined theme-icon">light_mode</span>
                      <span>Light</span>
                    </button>
                  </li>

                  <li className="theme-item">
                    <button data-theme="dark" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined theme-icon">dark_mode</span>
                      <span>Dark</span>
                    </button>
                  </li>
                </ul> }
              </div>
            </div>
          </div>

          <search className="search-wrapper">
            <form onSubmit={submitSearch} className="search-form">
              <input 
                className="input search-input"
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
                  type: 'SET_SEARCH_INPUT',
                  payload: e.target.value
                })} 
                type="search"
                placeholder="Search"
                value={state.searchInput}
              />

              <button className="search-btn">
                <span className="material-symbols-outlined search-icon">search</span>
              </button>
            </form>
          </search>

        </nav>
      </header>

      <header className="desktop-header" data-visible={visibleHeader? "true" : "false"}>
        <nav className="navigation">
          <div className="top-navigation">
            <Link className="logo" to='/'>Progressio</Link>

            <search className="search-wrapper">
              <form onSubmit={submitSearch} className="search-form">
                <input 
                  className="input search-input"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
                    type: 'SET_SEARCH_INPUT',
                    payload: e.target.value
                  })} 
                  type="search"
                  placeholder="Search"
                  value={state.searchInput}
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
                <span className="material-symbols-outlined header-btn-icon">favorite</span>
              </Link>

              <Link to="/cart" className="fav-btn header-btn">
                <span className="material-symbols-outlined header-btn-icon">shopping_cart</span>
              </Link>

              <div onClick={toggleThemeMenu} className="theme-switcher">
                <button 
                  className="theme-switcher-btn header-btn" 
                  aria-haspopup="menu" 
                  aria-expanded={visibleThemeMenu? "true" : "false"
                }>
                  <span className="material-symbols-outlined header-btn-icon">{themeIcon}</span>
                </button>
                { visibleThemeMenu && <ul className="theme-list">
                  <li className="theme-item">
                    <button data-theme="os" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined">contrast</span>
                      <span>OS</span>
                    </button>
                  </li>

                  <li className="theme-item">
                    <button data-theme="light" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined">light_mode</span>
                      <span>Light</span>
                    </button>
                  </li>

                  <li className="theme-item">
                    <button data-theme="dark" onClick={changeTheme} className="theme-btn">
                      <span className="material-symbols-outlined">dark_mode</span>
                      <span>Dark</span>
                    </button>
                  </li>
                </ul> }
              </div>
            </div>
          </div>
          
          <DesktopMenu />
          
        </nav>
      </header>
    </>
  )
}

export default Header;