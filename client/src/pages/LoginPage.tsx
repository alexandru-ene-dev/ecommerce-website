import { 
  useState, type MouseEvent,
  type ChangeEvent, type FormEvent,
  useEffect, useRef
} from 'react';
import { Link } from 'react-router-dom';

import loginUserService from '../services/loginUserService';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import delay from '../utils/delay';
import VisibilityOnIcon from '../images/icons/visibility-icon.svg?component';
import VisibilityOffIcon from '../images/icons/visibility-off-icon.svg?component';


const LoginPage = () => {
  const navigate = useNavigate();
  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ error, setError ] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [ visiblePass, setVisiblePass ] = useState(false);
  const [ isLoading, setLoading ] = useState(false);
  const [ isPageLoading, setIsPageLoading ] = useState(true);
  const { state, dispatch } = useAuthContext();
  const [ keepMeLogged, setKeepMeLogged ] = useState(false);


  useEffect(() => {
    const input = inputRef.current;
    if (!isPageLoading && input) input.focus();
  }, [isPageLoading]);


  if (state.isLoggedIn) {
    navigate('/profile');
  }


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
      const login = await loginUserService(email, pass, keepMeLogged);

      if (!login.success) {
        setError(login.message);
        return;
      }
  
      await delay(500);
      setLoading(false);
      dispatch({ type: 'LOGIN', payload: login.user });
      navigate('/profile');
      location.reload();

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const loadProfile = async () => {
      if (!state.isLoggedIn) {
        setIsPageLoading(true);
        await delay(500);
        setIsPageLoading(false);
      } else {
        await delay(500);
        setIsPageLoading(false);
      }
    }

    loadProfile();
  }, [state.isLoggedIn]);


  if (isPageLoading) {
    return (
      <section className="login-page loading">
        <h1 className="category-page-title">Loading Profile...</h1>

        <LoadingSpinner isLoading={isPageLoading} />
      </section>
    );
  }

  
  return (
    <>
      <LoadingSpinner isLoading={isLoading} />

      <section className="login-page">
        <h1 className="section_title">Hey there!</h1>

        <p>
          It seems you are not logged in. Log in or create an account to enjoy everything Progressio has to offer!
        </p>


        <div className="login-wrapper">
          <h2>Sign In</h2>
          <form id="login-form" onSubmit={handleLogin} className="login-form" noValidate>
            <div className="name-wrapper_flex">
              <label className="login-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                ref={inputRef} 
                onChange={handleEmailInput} 
                value={email} 
                className="input" 
                type="email" 
                placeholder="E-mail address" 
              />
            </div>

            <div className="login-page-pass-wrapper password-wrapper-flex">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                id="password"
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
                {visiblePass? <VisibilityOnIcon /> : <VisibilityOffIcon />}
              </button>
            </div>

            {error && <div role="alert" className="error-message">{error}</div>}

            <div className="forgot-pass-wrap">
              <label htmlFor="keep-logged" className="keep-logged-label">
                <input
                  onChange={() => setKeepMeLogged(prev => !prev)}
                  checked={keepMeLogged? true : false} 
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
              to="/register" 
              className="login-btn sign-in-btn"
            >
              Create Account
            </Link>

            <button className="login-btn sign-in-btn">Sign Up with Google</button>
          </div>
        </div>

      </section>
    </>
  );
};

export default LoginPage;