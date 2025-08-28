import { useInputContext } from '../hooks/useInputContext';
import { type MouseEvent, useState, useEffect } from 'react'; 
import MobileHeader from './MobileHeader.tsx';
import DesktopHeader from './DesktopHeader.tsx';
import StickySaleText from './StickySaleText.tsx';
import { type HeaderType } from './types.ts';


const Header = (
  { 
    showMenu, 
    closeModal, 
    visibleMenu, 
    toggleLoginMenu
  }: HeaderType
) => {

  const [ visibleHeader, setVisibleHeader ] = useState(true);
  const [ visibleThemeMenu, setThemeMenu ] = useState(false);
  const [ themeIcon, setThemeIcon ] = useState('contrast');
  const [ lastScroll, setLastScroll ] = useState(0);
  const { dispatch } = useInputContext();
  const [ searchInput, setSearchInput ] = useState('');


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
    <header className="header" data-visible={visibleHeader? "true" : "false"}>
      <MobileHeader
        showMenu={showMenu}
        visibleMenu={visibleMenu}
        closeModal={closeModal}
        visibleHeader={visibleHeader}
        submitSearch={submitSearch}
        toggleLoginMenu={toggleLoginMenu}
        toggleThemeMenu={toggleThemeMenu}
        visibleThemeMenu={visibleThemeMenu}
        themeIcon={themeIcon}
        changeTheme={changeTheme}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      /> 

      <DesktopHeader 
        visibleHeader={visibleHeader}
        submitSearch={submitSearch}
        toggleLoginMenu={toggleLoginMenu}
        toggleThemeMenu={toggleThemeMenu}
        visibleThemeMenu={visibleThemeMenu}
        themeIcon={themeIcon}
        changeTheme={changeTheme}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      <StickySaleText />
    </header>
  )
}

export default Header;