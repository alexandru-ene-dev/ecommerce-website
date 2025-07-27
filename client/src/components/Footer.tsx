import { type ChangeEvent, type FormEvent, useState, useEffect } from "react";
import { useInputContext } from "../hooks/useInputContext";
import { devLog } from "../utils/devLog";

const Footer = () => {
  const { state, dispatch } = useInputContext();
  const [ isFeedbackShown, setFeedback ] = useState<boolean>(false);
  const [ emailAddress, setEmailAddress] = useState<string>('');

  const subscribe = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    devLog('info', 'SUCCESS', 'You are now subscribed to our newsletter!');
    setEmailAddress(state.footerInput);
    setFeedback(true);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFeedback(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isFeedbackShown]);

  return (
    <footer className="footer">
      <section className="newsletter-section">
        <div className="newsletter-left">
          <h2 className="newsletter-title">Let's connect</h2>
          <p className="newsletter-par">
            Stay up to date with our huge sales, tech trends and giveaways campaigns.
          </p>
        </div>
        
        <div className="newsletter-right">
          <form onSubmit={subscribe} className="newsletter-form">
            <input
              className="input footer-input"
              type="email" 
              onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
                type: "SET_FOOTER_INPUT",
                payload: e.target.value
              })} 
              value={state.footerInput} 
              placeholder="Enter your email address"
            />
            <button className="subscribe-btn">Subscribe to newsletter</button>
          </form>

          <p className="newsletter-notice">
            By subscribing, you agree to receive marketing communications from PROGRESSIO and partners by email. You also consent to the use of your details in accordance with our Privacy Policy.
          </p>

          <section className={`subscribe-feedback ${isFeedbackShown? 'shown' : ''}`}>
            <p>You successfully subscribed to our newsletter using {emailAddress}!</p> 
            <p>Expect upcoming deals, we always have something that might spark your interest!</p>
          </section>
        </div>
      </section>

      <div className="links-social-wrapper">
        <section className="footer-links-panel-mobile">
          <details className="footer-links-details">
            <summary className="footer-links-summary">Customer Service</summary>
            <nav>
              <ul className="footer-links-list">
                <li><a href="#">Request a Return</a></li>
                <li><a href="#">Returns Information</a></li>
                <li><a href="#">Delivery Information</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </nav>
          </details>

          <details className="footer-links-details">
            <summary className="footer-links-summary">Privacy & Legal</summary>
            <nav>
              <ul className="footer-links-list">
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </nav>
          </details>

          <details className="footer-links-details">
            <summary className="footer-links-summary">Company</summary>
            <nav>
              <ul className="footer-links-list">
                <li><a href="#">Careers</a></li>
                <li><a href="#">About Us</a></li>
              </ul>
            </nav>
          </details>
        </section>

        <section className="footer-links-panel-desktop">
          <div>
            <h2>Customer Service</h2>
            <nav>
              <ul className="footer-links-list">
                {/* <li><a href="#">Request a Return</a></li> */}
                <li><a href="#">Returns Information</a></li>
                <li><a href="#">Delivery Information</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </nav>
          </div>

          <div>
            <h2>Privacy & Legal</h2>
            <nav>
              <ul className="footer-links-list">
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">Terms of Use</a></li>
              </ul>
            </nav>
          </div>

          <div>
            <h2>Company</h2>
            <nav>
            <ul className="footer-links-list">
              <li><a href="#">Careers</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </nav>
          </div>
        </section>

        <section className="social-wrapper">
          <h2 className="social-par">Our Social Network</h2>

          <ul className="social-list">
            <li className="social-item">
              <a className="social-link" href="https://www.facebook.com/">
                <img className="social-icon" src="/social-media/facebook.png" alt="facebook icon" />
              </a>
            </li>
            <li className="social-item">
              <a className="social-link" href="https://www.instagram.com/">
                <img className="social-icon" src="/social-media/instagram.png" alt="instagram icon" />
              </a>
            </li>
            <li className="social-item">
              <a className="social-link" href="https://www.youtube.com/">
                <img className="social-icon" src="/social-media/youtube.png" alt="youtube icon" />
              </a>
            </li>
            <li className="social-item">
            <a className="social-link" href="https://x.com/">
                <img className="social-icon" src="/social-media/twitter.png" alt="twitter icon" />
              </a>
            </li>
            <li className="social-item">
              <a className="social-link" href="https://pinterest.com/">
                <img className="social-icon" src="/social-media/pinterest.png" alt="pinterest icon" />
              </a>
            </li>
          </ul> 
        </section>
      </div>

      <p className="copyrights">
        <small>&copy;</small> 2025 Progressio.com
      </p>
    </footer>
  )
};

export default Footer;