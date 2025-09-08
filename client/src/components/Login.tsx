import { 
  useState, type MouseEvent,
  type ChangeEvent, type FormEvent, useRef,
  type Dispatch,
  type SetStateAction
} from 'react';

import { Link } from 'react-router-dom';
import loginUserService from '../services/loginUserService';
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


type LoginPropsType = {
  visibleLoginMenu: boolean,
  setVisibleLoginMenu: Dispatch<SetStateAction<boolean>>,
  showAccount: boolean,
  setShowAccount: Dispatch<SetStateAction<boolean>>,
  handleMenus: (menu: string) => void,
  activeMenu: string | null
};


const Login = forwardRef<HTMLDivElement, LoginPropsType>((
  { 
    visibleLoginMenu, 
    setVisibleLoginMenu, 
    showAccount, 
    setShowAccount,
    handleMenus,
    activeMenu
  }, ref
) => {

  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ error, setError ] = useState<string | null>(null);
  const [ visiblePass, setVisiblePass ] = useState(false);

  const [ isLoading, setLoading ] = useState(false);
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const loginWrapperRef = useRef<HTMLTableSectionElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const [ showLogoutConfirm, setLogoutConfirm ] = useState(false);
  const { avatar } = useAvatar();
  const nameInitial = state.user?.firstName.slice(0, 1).toUpperCase();
  const { setLocalCart } = useCartContext();
  const { setLocalFavorites } = useFavoritesContext();


  const togglePass = (e: MouseEvent) => {
    if (e) e.preventDefault();
    setVisiblePass(prev => !prev);
  };


  const handleEmailInput = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setEmail(target.value);
  };


  const handlePasswordInput = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target) return;
    setPass(target.value);
  };


  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const login = await loginUserService(email, pass);

      if (!login.success) {
        setError(login.message);
        return;
      }
  
      await delay(500);
      setLoading(false);
      dispatch({ type: 'LOGIN', payload: login.user });

      setVisibleLoginMenu(false);
      navigate('/profile');
      location.reload();

      setError(login.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


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
      setVisibleLoginMenu(false);
      handleMenus('');
      navigate('/');

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

  
  return (
    <div
      ref={ref}
      className="account-btn-wrapper"
      onClick={() => {
        handleMenus('login');
        setShowAccount(false);
      }}
      onMouseEnter={() => {
        if (!activeMenu || activeMenu === 'mobileMenu') {
          setShowAccount(true);
        }
      }}
      onMouseLeave={() => setShowAccount(false)}
    >
      <button className="account-btn header-btn">
        {state.isLoggedIn && avatar? 
          <img className="avatar" src={avatar} /> :
          <span className={
            state.isLoggedIn ?
              "header-btn_name-icon" :
              "material-symbols-outlined header-btn-icon"
          }>
            {state.isLoggedIn? nameInitial : "account_circle"}
          </span>
        }
      </button>


      {showAccount && (!activeMenu || activeMenu === 'mobileMenu') && 
        <div 
          onClick={(e) => {
            e.stopPropagation();
            handleMenus('login');
            setShowAccount(false);
          }} 
          className="account-hov-menu"
        >
          <h2>Progressio Account</h2>

          {state.isLoggedIn? 
            <div>
              <p>{`${state?.user?.firstName} ${state?.user?.lastName}`}</p>
              <p>{state?.user?.email}</p>
            </div> :

            <div>Login / Register</div>
          }
        </div>
      }


      {visibleLoginMenu && 
        <div 
          ref={loginWrapperRef} 
          className="login-wrapper"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
        >
          <button
            ref={closeButtonRef}
            onClick={() => {
              setShowAccount(false);
              handleMenus('');
            }} 
            className="close-menu-btn close-login-btn"
          >
            <span className="material-symbols-outlined">close</span>
          </button>

          {state.isLoggedIn && avatar? 
            <img className="login-avatar" src={avatar} /> :
            ( state.isLoggedIn? 
              <div className="account-initial">{nameInitial}</div> : null 
            )
          }

          <h2 className="login-title">
            {state.isLoggedIn? `Hey, ${state.user?.firstName}!` : 'Sign In'}
          </h2>

          {!state.isLoggedIn &&
            <div className="login-stats">
              <form onSubmit={handleLogin} className="login-form" noValidate>
                <input 
                  onChange={handleEmailInput} 
                  value={email} 
                  className="input" 
                  type="email" 
                  placeholder="E-mail address" 
                />

                <div className="login-pass-wrapper">
                  <input
                    onChange={handlePasswordInput}
                    value={pass}
                    className="input login-pass-inp" 
                    type={visiblePass? "text" : "password"} 
                    placeholder="Password" 
                  />

                  <button 
                    aria-label={visiblePass? "Hide password" : "Show password"} 
                    onClick={togglePass} 
                    className="visible-pass-btn"
                  >
                    <span 
                      className="material-symbols-outlined visible-pass-icon"
                    >
                      {visiblePass? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="forgot-pass-wrap">
                  <label htmlFor="keep-logged" className="keep-logged-label">
                    <input 
                      id="keep-logged" 
                      type="checkbox" 
                      className="keep-logged-checkbox checkbox-inp" 
                    />
                    <p className="keep-logged-text">Keep me logged in</p>
                  </label>

                  <a href="#">Forgot password?</a>
                </div>
                
                <button className="login-btn sign-in-btn">Sign In</button>
              </form>

              <div className="create-account-wrapper">
                <h2 className="login-title">New to Progressio?</h2>
              
                <p className="create-account-par">Create an account to check out faster and receive emails about your orders, new products, events and special offers!</p>
                
                <Link 
                  onClick={() => setVisibleLoginMenu(prev => !prev)} 
                  to="/register" 
                  className="login-btn sign-in-btn"
                >
                  Create Account
                </Link>

                <button className="login-btn sign-in-btn">Sign Up with Google</button>
              </div>
            </div>
          }

          {state.isLoggedIn &&
            <div className="account-stats">
              <Link 
                onClick={() => setVisibleLoginMenu(false)} 
                to='/profile' 
                className="new-card-btn"
              >
                Profile
              </Link>

              <button onClick={() => setLogoutConfirm(true)} className="new-card-btn">Log Out</button>

              {showLogoutConfirm && 
                <div className="logout-confirm-modal">
                  <p className="logout-confirm-par">Are you sure you want to logout?</p>

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

          <LoadingSpinner isLoading={isLoading} />
        </div>
      }

    </div>
  );
});

export default Login;