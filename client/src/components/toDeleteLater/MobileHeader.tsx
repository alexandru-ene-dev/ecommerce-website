// import { type ChangeEvent, useRef, useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { type MobileHeaderType } from './types';
// import ThemeSwitcher from './ThemeSwitcher';

// import { useAuthContext } from '../hooks/useAuthContext';
// import useLoadingContext from '../hooks/useLoadingContext';
// import useCartContext from '../hooks/useCartContext';
// import delay from '../utils/delay';

// import { useAvatar } from '../context/AuthContext/AvatarContext';
// import useFavoritesContext from '../hooks/useFavoritesContext';
// import useHandleCart from '../hooks/useHandleCart';
// import useHandleFavorites from '../hooks/useHandleFavorites';
// import { useInputContext } from '../hooks/useInputContext';


// const MobileHeader = (
//   {
//     visibleMenu,
//     showMenu,
//     submitSearch,
//     toggleLoginMenu,

//     toggleThemeMenu,
//     visibleThemeMenu,
//     changeTheme,

//     searchInput,
//     setSearchInput,
//     closeModal,
//   }: MobileHeaderType
// ) => {

//   const hamburgerBtnRef = useRef<HTMLButtonElement>(null);
//   const { localFavorites, setLocalFavorites } = useFavoritesContext();
//   const { localCart, setLocalCart } = useCartContext();
//   const { state } = useAuthContext();

//   const nameInitial = state.user?.firstName.slice(0, 1).toUpperCase();
//   const { setLoading } = useLoadingContext();
//   const [ isFavoritesHovered, setIsFavoritesHovered ] = useState(false);
//   const { avatar } = useAvatar();

//   const [ showAccount, setShowAccount ] = useState(false);
//   const { handleCart } = useHandleCart(setLocalCart);
//   const { handleFavorites } = useHandleFavorites(setLocalFavorites);
//   const { state: themeState } = useInputContext();

  
//   const toggleFavMenu = () => {
//     setIsFavoritesHovered(prev => !prev);
//   };


//   const handleReload = async () => {
//     setLoading(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     closeModal();
    
//     await delay(500);
//     setLoading(false);
//   };


//   useEffect(() => {
//     const handleFavMenuOnScroll = () => {
//       const currentScroll = window.scrollY;
      
//       if (currentScroll > 0) {
//         setIsFavoritesHovered(false);
//       }
//     };

//     window.addEventListener('scroll', handleFavMenuOnScroll);
//     return () => window.removeEventListener('scroll', handleFavMenuOnScroll);
//   }, []);


//   return (
//     <div className="mobile-header">
//       <nav className="navigation">
//         <div className="mobile-nav-wrapper">
//           <button 
//             data-closed-icon={visibleMenu? 'true' : 'false'} 
//             ref={hamburgerBtnRef} 
//             className="hamburger-btn" 
//             onClick={showMenu}
//           >
//             <div className="hamburger">
//               <span className="hamburger-line ham-line1"></span>
//               <span className="hamburger-line ham-line2"></span>
//               <span className="hamburger-line ham-line3"></span>
//             </div>
//           </button>

//           <Link onClick={handleReload} to="/" className="logo">
//             Pr
//               <span className="material-symbols-outlined cog-icon">settings</span>
//             gressio
//           </Link>

//           <div className="header-btns">
//             <div
//               onClick={toggleLoginMenu}
//               onMouseEnter={state?.isLoggedIn? () => setShowAccount(true) : () => null} 
//               onMouseLeave={() => setShowAccount(false)}
//               className="account-btn-wrapper"
//             >
//               <button 
//                 onClick={toggleLoginMenu} 
//                 className="account-btn header-btn"
//               >
//                 {state.isLoggedIn && avatar? 
//                   <img className="avatar" src={avatar} /> :
//                   <span className={
//                     state.isLoggedIn ?
//                       "header-btn_name-icon" :
//                       "material-symbols-outlined header-btn-icon"
//                   }>
//                     {state.isLoggedIn? nameInitial : "account_circle"}
//                   </span>
//                 }
//               </button>

//               {showAccount && <div onClick={toggleLoginMenu} className="account-hov-menu">
//                 <h2>Progressio Account</h2>
//                 <p>{`${state?.user?.firstName} ${state?.user?.lastName}`}</p>
//                 <p>{state?.user?.email}</p>
//               </div>}
//             </div>

//             <div className="fav-wrap">
//               <button 
//                 onClick={() => {
//                   closeModal();
//                   toggleFavMenu();
//                 }}  
//                 className="fav-btn header-btn"
//               >
//                 <span className="material-symbols-outlined header-btn-icon">
//                   favorite
//                   {localFavorites && localFavorites?.length > 0 && 
//                     <span className="fav-cart-count">{localFavorites?.length}</span>}
//                 </span>
//               </button>

//               {isFavoritesHovered && 
//                 <div onClick={(e) => e.stopPropagation()} className="fav-hover_menu">
//                   <h1 className="favorites-title">
//                     <span className="material-symbols-outlined favorites-icon">favorite</span>
//                     <span>Your Favorites</span>
//                   </h1>

//                   {localFavorites && localFavorites.map((prod) => {
//                     const isFavorite = localFavorites && localFavorites.some(p => p._id === prod._id);
//                     const isInCart = localCart && localCart.some(p => p._id === prod._id);
//                     const imgSrc = new URL(`../assets/images/${prod.img}`, import.meta.url).href;
//                     const slug = prod.title.replaceAll(' ', '-');
                    
//                     return (
//                       <div key={prod._id} className="fav-hover_prod">
//                         <Link onClick={() => setIsFavoritesHovered(false)} to={`/products/${slug}`}>
//                           <img className="fav-hover_img" src={imgSrc} />
//                         </Link>

//                         <Link onClick={() => setIsFavoritesHovered(false)} to={`/products/${slug}`} className="fav-hover_prod-title">
//                           {prod.title}
//                         </Link>

//                         <p className="fav-hover_prod-price">${prod.price}</p>

//                         <button 
//                           onClick={() => handleFavorites(prod, isFavorite)} className="fav-hover_remove-btn"
//                         >
//                           <span className="material-symbols-outlined">close</span>
//                         </button>

//                         <button 
//                           onClick={() => handleCart(prod, isInCart)}
//                           className="fav-hover_remove-btn"
//                         >
//                           <span className="material-symbols-outlined fav-hover_cart-ico">
//                             {isInCart? "remove_shopping_cart" : "add_shopping_cart"}
//                           </span>
//                         </button> 
//                       </div>
//                     );
//                   })}

//                   {localFavorites && localFavorites.length === 0 && 
//                     <div className="fav-hover_menu-no-fav"><span className="material-symbols-outlined fav-hover_fav-icon">favorite</span> You didn't save any favorites yet...</div>
//                   }

//                   <Link 
//                     onClick={() => setIsFavoritesHovered(false)} 
//                     to="/favorites" 
//                     className="fav-hover_btn new-card-btn"
//                   >
//                     Go to Favorites
//                   </Link>
//                 </div>
//               }
//             </div>

//             <Link onClick={closeModal} to="/cart" className="cart-btn header-btn">
//               <span className="material-symbols-outlined header-btn-icon">
//                 shopping_cart
//                 {localCart && localCart.length > 0 && 
//                   <span className="fav-cart-count">{localCart.length}</span>}
//               </span>
//             </Link>

//             <ThemeSwitcher
//               toggleThemeMenu={toggleThemeMenu}
//               visibleThemeMenu={visibleThemeMenu}
//               themeIcon={themeState.themeIcon}
//               changeTheme={changeTheme}
//             />
//           </div>
//         </div>

//         <search className="search-wrapper">
//           <form onSubmit={submitSearch} className="search-form">
//             <input 
//               className="input search-input"
//               onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)} 
//               type="search"
//               placeholder="Search"
//               value={searchInput}
//             />

//             <button className="search-btn">
//               <span className="material-symbols-outlined search-icon">search</span>
//             </button>
//           </form>
//         </search>

//       </nav>
//     </div>
//   );
// };

// export default MobileHeader;