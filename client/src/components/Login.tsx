import { 
  useEffect,
  useState, 
  type MouseEvent,
  type ChangeEvent,
  type FormEvent 
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import loginUserService from '../services/loginUserService';
import { useNavigate } from 'react-router-dom';

const Login = (
  { visibleLoginMenu, closeLoginMenu }: 
  { visibleLoginMenu: boolean, closeLoginMenu: () => void }
) => {

  const [ email, setEmail ] = useState('');
  const [ pass, setPass ] = useState('');
  const [ error, setError ] = useState<string | null>(null);
  const [ fadeMenuIn, setFadeMenuIn ] = useState(false);
  const [ visiblePass, setVisiblePass ] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const html = document.documentElement;

    if (visibleLoginMenu) {
      html.style.setProperty('overflow', 'hidden');
    } else {
      html.style.setProperty('overflow', 'auto');
    }

    return () => html.style.setProperty('overflow', 'auto');
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
      const login = await loginUserService(email, pass);

      if (!login.success) {
        setError(login.message);
        return;
      }
  
      const decoded = jwtDecode(login.token);
      navigate('/profile');
      closeLoginMenu();
      setError(login.message);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section data-appear={fadeMenuIn} className="login-wrapper">
      <h2 className="login-title">Sign In</h2>

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

        <label htmlFor="keep-logged" className="keep-logged-label">
          <input 
            id="keep-logged" 
            type="checkbox" 
            className="keep-logged-checkbox checkbox-inp" 
          />
          <p className="keep-logged-text">Keep me logged in</p>
        </label>

        <a href="#">Forgot password?</a>
        
        <button className="login-btn sign-in-btn">Sign in</button>

      </form>

      <div className="create-account-wrapper">
        <h2 className="login-title">New to Progressio?</h2>
      
        <p className="create-account-par">Create an account to check out faster and receive emails about your orders, new products, events and special offers!</p>
        
        <Link onClick={closeLoginMenu} to="/register" className="login-btn create-account-link">Create an account</Link>
        <button className="login-btn">Sign Up with Google</button>

        <button 
          onClick={closeLoginMenu} 
          className="close-menu-btn close-login-btn"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    
    </section>
  );
};

export default Login;