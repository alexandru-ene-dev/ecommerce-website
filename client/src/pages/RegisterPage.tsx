import { useState, type MouseEvent, type ChangeEvent, type FormEvent } from 'react';
import registerUser from '../services/registerUserService.ts';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [ visiblePass, setVisiblePass ] = useState(false);
  const [ visibleConfirmPass, setVisibleConfirmPass ] = useState(false);
  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirmPass, setConfirmPass ] = useState('');
  const [ acceptTerms, setAcceptTerms ] = useState(false);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ error, setError ] = useState('');

  const navigate = useNavigate();

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
    const registration = await registerUser(
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPass,
      acceptTerms
    );

    if (!registration.success && registration.message) {
      setError(registration.message);
      return;
    }

    setLoggedIn(true);
    navigate('/home');
  };

  return (
    <section className="create-account-section">
      <h1 className="register-title">Create Account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="name-wrapper">
          <div className="name-wrapper_flex">
            <label htmlFor="first-name">First Name *</label>
            <input 
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
              <span 
                className="material-symbols-outlined visible-pass-icon"
              >
                {visiblePass? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
          <p>Must include at least 8 characters, an upper and a lowercase character, a number and a special character.</p>
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
                className="material-symbols-outlined visible-pass-icon"
              >
                {visibleConfirmPass? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <label className="checkbox-label">
          <input
            onChange={() => {
              setAcceptTerms(prev => {
                const f = !prev;
                return f;
              })}
            }
            className="checkbox-inp" 
            type="checkbox"
            checked={acceptTerms? true : false}
          />
          <p>I have read and agree with <a className="terms-link" href="#">Progressio Terms and Conditions</a>, <a className="terms-link" href="#">Privacy Policy</a> and confirm I am at least 16 years old.</p>
        </label>

        <label className="checkbox-label">
          <input className="checkbox-inp" type="checkbox" />
          <p>Optional: I subscribe to Progressio Newsletter</p>
        </label>

        {error && <div className="error-message">{error}</div>}
        <button className="create-account-btn">Create account</button>
      </form>
    </section>
  );
}

export default Register;