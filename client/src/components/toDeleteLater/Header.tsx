// import { useInputContext } from '../hooks/useInputContext';
// import { type MouseEvent, useState, useEffect } from 'react'; 
// import MobileHeader from './MobileHeader.tsx';
// import DesktopHeader from './DesktopHeader.tsx';

// import StickySaleText from './StickySaleText.tsx';
// import { type HeaderType } from './types.ts';
// import { changeThemeService } from '../services/changeThemeService.ts';
// import { useAuthContext } from '../hooks/useAuthContext.ts';


// const Header = (
//   { 
//     showMenu, 
//     closeModal, 
//     visibleMenu, 
//     toggleLoginMenu
//   }: HeaderType
// ) => {

//   const [ visibleHeader, setVisibleHeader ] = useState(true);
//   const [ visibleThemeMenu, setThemeMenu ] = useState(false);
//   const [ lastScroll, setLastScroll ] = useState(0);

//   const { dispatch } = useInputContext();
//   const [ searchInput, setSearchInput ] = useState('');
//   const { state } = useAuthContext();


//   const submitSearch = (e: MouseEvent<HTMLFormElement>) => {
//     if (e) e.preventDefault(); 
//   };


//   const toggleThemeMenu = (e: MouseEvent) => {
//     e.stopPropagation();
//     setThemeMenu(prev => !prev);
//   }


//   const changeTheme = (e: MouseEvent) => {
//     const target = e.currentTarget as HTMLElement;
//     if (!target) return;

//     if (target.dataset.theme === 'os') {
//       document.body.classList.remove('light-mode');
//       document.body.classList.remove('dark-mode');

//       dispatch({ type: 'TOGGLE_THEME', theme: 'os-default', themeIcon: 'contrast' });
//       if (state.user) {
//         changeThemeService(state.user._id, 'os-default');
//         return;
//       }
//       localStorage.setItem('theme', 'os_default');

//     } else if (target.dataset.theme === 'light') {
//       document.body.classList.remove('dark-mode');
//       document.body.classList.add('light-mode');

//       dispatch({ type: 'TOGGLE_THEME', theme: 'light-mode', themeIcon: 'light_mode' });
//       if (state.user) {
//         changeThemeService(state.user._id, 'light-mode');
//         return;
//       }
//       localStorage.setItem('theme', 'light-mode');

//     } else {
//       document.body.classList.remove('light-mode');
//       document.body.classList.add('dark-mode');

//       dispatch({ type: 'TOGGLE_THEME', theme: 'dark-mode', themeIcon: 'dark_mode' });
//       if (state.user) {
//         changeThemeService(state.user._id, 'dark-mode');
//         return;
//       }
//       localStorage.setItem('theme', 'dark-mode');
//     }
//   };


//   useEffect(() => {
//     const handleOutsideThemeClick = (e: Event) => {
//       const target = e.target as HTMLElement;
//       if (!target) return;

//       if (
//         !target.closest('.theme-btn') && !target.closest('.theme-menu')
//       ) {
//         setThemeMenu(false);
//       }
//     };

//     document.addEventListener('click', handleOutsideThemeClick);
//     return () => document.removeEventListener('click', handleOutsideThemeClick);
//   }, []);


//   useEffect(() => {
//     const toggleVisibleHeader = () => {
//       const currentScroll = window.scrollY;

//       if (currentScroll === 0) {
//         setVisibleHeader(true);
//       } else if (currentScroll > lastScroll) {
//         setVisibleHeader(false);
//       } else {
//         setVisibleHeader(true);
//       }

//       setLastScroll(currentScroll);
//     };

//     window.addEventListener('scroll', toggleVisibleHeader);
//     return () => window.removeEventListener('scroll', toggleVisibleHeader);
//   }, [lastScroll]);


//   return (
//     <header className="header" data-visible={visibleHeader? "true" : "false"}>
//       <MobileHeader
//         showMenu={showMenu}
//         visibleMenu={visibleMenu}
//         closeModal={closeModal}
//         visibleHeader={visibleHeader}

//         submitSearch={submitSearch}
//         toggleLoginMenu={toggleLoginMenu}
//         toggleThemeMenu={toggleThemeMenu}
//         visibleThemeMenu={visibleThemeMenu}

//         changeTheme={changeTheme}
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//       /> 

//       <DesktopHeader 
//         visibleHeader={visibleHeader}
//         submitSearch={submitSearch}
//         toggleLoginMenu={toggleLoginMenu}
//         toggleThemeMenu={toggleThemeMenu}

//         visibleThemeMenu={visibleThemeMenu}
//         changeTheme={changeTheme}
//         searchInput={searchInput}
//         setSearchInput={setSearchInput}
//       />

//       <StickySaleText />
//     </header>
//   )
// }

// export default Header;