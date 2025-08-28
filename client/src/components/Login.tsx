import { 
  useEffect, useState, type MouseEvent,
  type ChangeEvent, type FormEvent, useRef 
} from 'react';
import { Link } from 'react-router-dom';
import loginUserService from '../services/loginUserService';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from './LoadingSpinner';
import delay from '../utils/delay';
import logoutService from '../services/logoutService';


const Login = (
  { visibleLoginMenu, closeLoginMenu }: 
  { visibleLoginMenu: boolean, closeLoginMenu: () => void }
) => {

  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ error, setError ] = useState<string | null>(null);
  const [ fadeMenuIn, setFadeMenuIn ] = useState(false);
  
  const [ visiblePass, setVisiblePass ] = useState(false);
  const [ isLoading, setLoading ] = useState(false);
  const { state, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const loginWrapperRef = useRef<HTMLTableSectionElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [ showLogoutConfirm, setLogoutConfirm ] = useState(false);
  // const [ visibleLoginMenu, setVisibleLoginMenu ] = useState(false);
  // const [ shouldRenderLogin, setShouldRender ] = useState(false);


  // useEffect(() => {
  //   if (visibleLoginMenu) {
  //     setShouldRender(true);
  //   } else {
  //     const timeout = setTimeout(() => setShouldRender(false), 200);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [visibleLoginMenu]);


  // const closeLoginMenu = () => {
  //   setVisibleLoginMenu(false);
  // };


  // const toggleLoginMenu = () => {
  //   const show = !visibleLoginMenu;
  //   setVisibleLoginMenu(show);
  //   // closeModal();
  // };


  const togglePass = (e: MouseEvent) => {
    if (e) e.preventDefault();
    setVisiblePass(prev => !prev);
  };


  useEffect(() => {
    if (visibleLoginMenu) {
      const timeout = setTimeout(() => {
        setFadeMenuIn(true);
      }, 10);

      return () => clearTimeout(timeout);
    } else {
      setFadeMenuIn(false);
    }
  }, [visibleLoginMenu]);


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
      closeLoginMenu();
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
      closeLoginMenu();
      navigate('/');
      // location.reload();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <section ref={loginWrapperRef} data-appear={fadeMenuIn} className="login-wrapper">
      <button
        ref={closeButtonRef}
        onClick={closeLoginMenu} 
        className="close-menu-btn close-login-btn"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

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

            {error && <div className="error-message">${error}</div>}

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
            
            <button className="login-btn sign-in-btn">Sign in</button>
          </form>

          <div className="create-account-wrapper">
            <h2 className="login-title">New to Progressio?</h2>
          
            <p className="create-account-par">Create an account to check out faster and receive emails about your orders, new products, events and special offers!</p>
            
            <Link onClick={closeLoginMenu} to="/register" className="login-btn create-account-link">Create an account</Link>
            <button className="login-btn">Sign Up with Google</button>
          </div>
        </div>
      }

      {state.isLoggedIn &&
      // <div className="account-modal">
        <div className="account-stats">
          <Link onClick={closeLoginMenu} to='/profile' className="new-card-btn">Profile</Link>

          <button onClick={() => setLogoutConfirm(true)} className="new-card-btn">Log Out</button>

          {showLogoutConfirm && <div className="logout-confirm-modal">
            <p className="logout-confirm-par">Are you sure you want to logout?</p>
            <button className="new-card-btn confirm-logout-btn" onClick={handleLogout}>Yes, log me out</button>
            <button className="new-card-btn confirm-logout-btn" onClick={() => setLogoutConfirm(false)}>Cancel</button>
          </div>}
        </div>
      // </div>
      }

      <LoadingSpinner isLoading={isLoading} setLoading={setLoading} />
    
    </section>
  );
};

export default Login;