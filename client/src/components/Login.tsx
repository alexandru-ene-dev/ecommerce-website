import { useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';

const Login = (
  { visibleLoginMenu, closeLoginMenu }: 
  { visibleLoginMenu: boolean, closeLoginMenu: () => void }
) => {

  const [ fadeMenuIn, setFadeMenuIn ] = useState(false);
  const [ visiblePass, setVisiblePass ] = useState(false);

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

  return (
    <section data-appear={fadeMenuIn} className="login-wrapper">
      <h2 className="login-title">Sign In</h2>

      <form className="login-form">
        <input className="input" type="email" placeholder="E-mail address" />
        <div className="login-pass-wrapper">
          <input 
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
        <button className="login-btn sign-in-btn">Sign in</button>

        <a href="#">Forgot password?</a>
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