import { useState, type Dispatch, type SetStateAction, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from './LoadingSpinner';

import delay from '../utils/delay';
import logoutService from '../services/logoutService';
import { useAvatar } from '../context/AuthContext/AvatarContext';
import useCartContext from '../hooks/useCartContext';
import { getCart } from '../utils/cartStorage';

import { getLocalFavorites } from '../utils/localFavorites';
import useFavoritesContext from '../hooks/useFavoritesContext';
import { forwardRef } from 'react';
import { useThemeContext } from '../hooks/useThemeContext';
import { type Theme, type ThemeIcon } from '../context/types';
import ProfileIcon from '../images/icons/profile-icon.svg?component';
import ProfileSquareIcon from '../images/icons/profile-icon2.svg?component';
import LoginIcon from '../images/icons/login-icon.svg?component';
import LogoutIcon from '../images/icons/logout-icon.svg?component';


type LoginPropsType = {
  visibleLoginMenu?: boolean,
  setVisibleLoginMenu?: Dispatch<SetStateAction<boolean>>,
  handleMenus?: (menu: string) => void,
};


const Login = forwardRef<HTMLDivElement, LoginPropsType>((
  { 
    visibleLoginMenu, 
    setVisibleLoginMenu,
    handleMenus,
  }, ref
) => {

  const { state, dispatch } = useAuthContext();
  const { avatar } = useAvatar();
  const nameInitial = state.user?.firstName.slice(0, 1).toUpperCase();
  const [ showLogoutConfirm, setLogoutConfirm ] = useState(false);
  const { setLocalCart } = useCartContext();

  const { setLocalFavorites } = useFavoritesContext();
  const { dispatch: themeDispatch } = useThemeContext();
  const [ isLoading, setLoading ] = useState(false);
  const [ _, setError ] = useState<string | null>(null);
  const navigate = useNavigate();
  const accountBtnRef = useRef<HTMLButtonElement | null>(null);


  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logoutService();

      if (!result.success) {
        setError(result.message);
        return;
      }

      await delay(1000);
      setLoading(false);
      dispatch({ type: 'LOGOUT', payload: null });

      handleMenus?.('');
      navigate('/');
      
      const localTheme = localStorage.getItem('theme') as Theme || 'os-default';
      themeDispatch({ 
        type: 'TOGGLE_THEME', 
        theme: localTheme, 
        themeIcon: (localTheme === 'os-default'? 'contrast' : localTheme.replace('-', '_')) as ThemeIcon
      });

      const cart = getCart();
      setLocalCart(cart);
      const favorites = getLocalFavorites();
      setLocalFavorites(favorites);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (!target.closest('.login-wrapper')) {
        setLogoutConfirm(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);


  useEffect(() => {
    if (!showLogoutConfirm) return;

    const focusableEls = document.querySelectorAll(
      '.logout-confirm-modal button'
    ) as NodeListOf<HTMLButtonElement>;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      } else if (e.key === 'Escape') {
        setLogoutConfirm(false);
        accountBtnRef.current?.focus();
      }
    };

    document.addEventListener('keydown', trapFocus);
    firstEl.focus();

    return () => document.removeEventListener('keydown', trapFocus);
  }, [showLogoutConfirm]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setVisibleLoginMenu?.(false);

      const accountBtn = accountBtnRef.current;
      if (!accountBtn) return;
      accountBtn.focus();
    }
  };


  useEffect(() => {
    if (visibleLoginMenu) {
      handleFocusFirstElement();
    }
  }, [visibleLoginMenu]);


  const handleFocusFirstElement = () => {
    const firstFocusableEl = document.querySelectorAll(
      '.login-wrapper [role="menuitem"]'
    )[0] as HTMLElement;

    firstFocusableEl?.focus();
  };

  
  return (
    <>
      <LoadingSpinner isLoading={isLoading} />

      <div ref={ref} className="account-btn-wrapper">
        <button
          ref={accountBtnRef} 
          className="account-btn header-btn"
          aria-label="Account" 
          aria-haspopup="true" 
          aria-controls="login-menu" 
          aria-expanded={visibleLoginMenu? 'true' : 'false'}
          onClick={() => handleMenus?.('login')}
        >
          {state.isLoggedIn && avatar? 
            <img className="avatar" src={avatar} /> :
            <div>
              {state.isLoggedIn ?
                <span className="header-btn_name-icon">
                  {nameInitial}
                </span> :
                
                <ProfileIcon className="header-btn" />
              }
            </div>
          }
        </button>


        {visibleLoginMenu && setVisibleLoginMenu &&
          <div
            onKeyDown={handleKeyDown} 
            role="menu" 
            id="login-menu" 
            className="login-wrapper"
            tabIndex={-1}
          >
            {!state.isLoggedIn &&
              <Link
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenus?.('');
                }} 
                role="menuitem" 
                className="new-card-btn" 
                to="/login"
              >
                <LoginIcon />
                <span>Login or Register</span>
              </Link>
            }


            {state.isLoggedIn &&
              <div className="account-stats">
                <Link 
                  onClick={(e) => {
                    e.stopPropagation();
                    setVisibleLoginMenu(false);
                    if (handleMenus) handleMenus('');
                  }}
                  id="menu2"
                  role="menuitem" 
                  to='/profile' 
                  className="new-card-btn"
                >
                  <ProfileSquareIcon />
                  <span>Profile</span>
                </Link>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLogoutConfirm(true);
                  }}
                  role="menuitem" 
                  className="new-card-btn"
                >
                  <LogoutIcon />
                  <span>Log Out</span> 
                </button>

                {showLogoutConfirm && 
                  <div 
                    className="logout-confirm-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-title"
                  >
                    <p id="logout-title" className="logout-confirm-par">Are you sure you want to logout?</p>

                    <button 
                      className="new-card-btn confirm-logout-btn" 
                      onClick={handleLogout}
                    >
                      Yes, log me out
                    </button>

                    <button 
                      className="new-card-btn confirm-logout-btn" 
                      onClick={() => setLogoutConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </>
  );
});

export default Login;