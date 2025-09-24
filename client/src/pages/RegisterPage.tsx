import { 
  useState, useRef, type MouseEvent,
  type ChangeEvent, type FormEvent,
  useEffect 
} from 'react';
import registerUserService from '../services/registerUserService.ts';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import delay from '../utils/delay.ts';

import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext.ts';
import ValidationItem from '../components/ValidationItem.tsx';
import useCartContext from '../hooks/useCartContext.ts';
import { useAvatar } from '../context/AuthContext/AvatarContext.tsx';
import useFavoritesContext from '../hooks/useFavoritesContext.ts';
import VisibilityOnIcon from '../images/icons/visibility-icon.svg?component';
import VisibilityOffIcon from '../images/icons/visibility-off-icon.svg?component';


const Register = () => {
  const [ visiblePass, setVisiblePass ] = useState(false);
  const [ visibleConfirmPass, setVisibleConfirmPass ] = useState(false);
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');

  const [ password, setPassword ] = useState('');
  const [ confirmPass, setConfirmPass ] = useState('');
  const [ acceptTerms, setAcceptTerms ] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ isLoading, setLoading ] = useState(false);
  
  const [ keepMeLogged, setKeepMeLogged ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  const validations = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*~]/.test(password),
  };

  const isFirstNameValid = /^[a-zA-Z\s]{2,}$/.test(firstName.trim());
  const isLastNameValid = /^[a-zA-Z\s]{2,}$/.test(lastName.trim());
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = Object.values(validations).every(Boolean);

  const { setLocalCart } = useCartContext();
  const { setLocalFavorites } = useFavoritesContext();
  const { setAvatar } = useAvatar();


  const togglePass = (e: MouseEvent) => {
    if (e) e.preventDefault();
    setVisiblePass(prev => !prev);
  };


  const toggleConfirmPass = (e: MouseEvent) => {
    if (e) e.preventDefault();
    setVisibleConfirmPass(prev => !prev);
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const userData = {
        firstName, 
        lastName, 
        email, 
        password, 
        confirmPass,
        acceptTerms,
        keepMeLogged
      };

      if (!isFirstNameValid || !isLastNameValid) {
        setError(`Name must contain at least 2 characters and only letters`);
        return;
      }

      if (!isEmailValid) {
        setError(`Invalid email format`);
        return;
      }

      if (!isPasswordValid) {
        setError(`Password doesn't meet strength requirements`);
        return;
      }

      const registration = await registerUserService(userData);
  
      if (!registration.success && registration.message) {
        setLoading(false);
        setError(registration.message);
        return;
      }
      
      setError(null);
      await delay(1000);
      setLoading(false);
      setIsModalOpen(true);
      dispatch({ type: 'LOGIN', payload: registration.user });

      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPass('');
      setAcceptTerms(false);

      await delay(5000);
      setIsModalOpen(false);
      navigate('/profile');

      const safeCart = 
        Array.isArray(registration.user.cart)? registration.user.cart : [];
      const safeFav = 
        Array.isArray(registration.user.favorites)? registration.user.favorites : [];

      setLocalCart(safeCart);
      setLocalFavorites(safeFav);
      setAvatar(null);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError(`Unexpected error occurred: ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const closeDialogButton = closeDialogRef.current;
    if (!closeDialogButton) return;

    if (isModalOpen) {
      closeDialogButton.focus();
    } else {
      closeDialogButton.blur();
    }
  }, [isModalOpen]);


  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);


  return (
    <section className="create-account-section">
      <h1 className="register-title">Create Account</h1>

      <form name="register-form" onSubmit={handleSubmit} noValidate>
        <div className="name-wrapper">
          <div className="name-wrapper_flex">
            <label htmlFor="first-name">First Name *</label>
            <input
              ref={firstNameRef} 
              value={firstName} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
              className="input register-input" 
              id="first-name" 
              type="text" 
            />
          </div>

          <div className="name-wrapper_flex">
            <label htmlFor="last-name">Last Name *</label>
            <input
              value={lastName} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
              className="input register-input" 
              id="last-name" 
              type="text" 
            />
          </div>
        </div>
        
        <div className="email-wrapper-flex">
          <label htmlFor="email">Email Address *</label>
          <input
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="input register-input" 
            id="email" 
            type="email"
          />
        </div>

        <div className="password-wrapper-flex">
          <label htmlFor="password">Password *</label>
          <div className="register-pass-inp-wrapper">
            <input
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="input register-input" 
              id="password" 
              type={visiblePass? "text" : "password"} 
            />

            <button 
              aria-label={visiblePass? "Hide password" : "Show password"} 
              onClick={togglePass} 
              className="visible-pass-btn"
            >
              {visiblePass? <VisibilityOffIcon /> : <VisibilityOnIcon />}
            </button>
          </div>

          <p>Must include at least 8 characters, an upper and a lowercase character, a number and a special character.</p>

          <ul aria-live="polite" aria-atomic="true" className="password-requirements">
            <ValidationItem label="At least 8 characters" valid={validations.length} />
            <ValidationItem label="At least one lowercase letter" valid={validations.lowercase} />
            <ValidationItem label="At least one uppercase letter" valid={validations.uppercase} />
            <ValidationItem label="At least one number" valid={validations.number} />
            <ValidationItem label="At least one special character (!@#$%^&*)" valid={validations.special} />
          </ul>
        </div>
        
        <div className="password-wrapper-flex">
          <label htmlFor="confirm-pass">Confirm Password *</label>
          <div className="register-pass-inp-wrapper">
            <input
              value={confirmPass}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPass(e.target.value)}
              className="input register-input" 
              id="confirm-pass" 
              type={visibleConfirmPass? "text" : "password"} 
            />

            <button 
              aria-label={visibleConfirmPass? "Hide password" : "Show password"} 
              onClick={toggleConfirmPass} 
              className="visible-pass-btn"
            >
              <span
                aria-hidden="true" 
                className="material-symbols-outlined visible-pass-icon"
              >
                {visibleConfirmPass? <VisibilityOffIcon /> : <VisibilityOnIcon />}
              </span>
            </button>
          </div>
        </div>

        <label htmlFor="accept-terms" className="checkbox-label">
          <input
            id="accept-terms"
            onChange={() => setAcceptTerms(prev => !prev)}
            className="checkbox-inp" 
            type="checkbox"
            checked={acceptTerms? true : false}
          />
          <p>I have read and agree with <a className="terms-link" href="#">Progressio Terms and Conditions</a>, <a className="terms-link" href="#">Privacy Policy</a> and confirm I am at least 16 years old.</p>
        </label>

        <label htmlFor="optional-subscribe" className="checkbox-label">
          <input id="optional-subscribe" className="checkbox-inp" type="checkbox" />
          <p>Optional: I subscribe to Progressio Newsletter</p>
        </label>

        <label htmlFor="keep-logged" className="checkbox-label">
          <input
            id="keep-logged" 
            type="checkbox" 
            className="checkbox-inp"
            onChange={() => setKeepMeLogged(prev => !prev)}
            checked={keepMeLogged? true: false} 
          />
          <p>Keep me logged in</p>
        </label>

        {error && <div className="error-message" role="alert">{error}</div>}
        <button className="create-account-btn">Create Account</button>
      </form>

      <div
        role="dialog"
        aria-live="assertive"
        aria-hidden={isModalOpen? "false" : "true"}
        aria-labelledby="success-register"
        aria-modal="true" 
        data-open={isModalOpen? "true" : "false"}
        tabIndex={isModalOpen? 0 : -1} 
        className="success-register_modal"
      >
        <div className="success-register_modal-content">
          <p id="success-register" className="success-register_par"> 
            You now have a Progressio account!
          </p>
          <p className="success-register_par">Use your credentials to log in.</p>
          <p className="success-register_par">Enjoy the experience of unbeatable tech deals, exclusive discounts, and the smartest way to shop online!</p>

          <button
            ref={closeDialogRef}
            aria-label="Close dialog" 
            className="close-menu-btn close-login-btn" 
            onClick={() => {
              setFirstName('');
              setLastName('');
              setEmail('');
              setPassword('');
              setConfirmPass('');
              setAcceptTerms(false);
              setIsModalOpen(false);
              navigate('/profile');
            }}
          >
            <span aria-hidden="true" className="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <LoadingSpinner isLoading={isLoading} />
    </section>
  );
}

export default Register;