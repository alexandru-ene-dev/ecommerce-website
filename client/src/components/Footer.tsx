import { type ChangeEvent, type FormEvent, useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { devLog } from "../utils/devLog";
import FooterLinks from "./FooterLinks";
import SocialLinks from "./SocialLinks";


const Footer = (
  {
    isBtnVisible,
    stickyBtnHeight,
    setStickyBtnHeight
  }:
  {
    isBtnVisible: boolean,
    stickyBtnHeight: number,
    setStickyBtnHeight:  Dispatch<SetStateAction<number>>
  }
) => {
  const [ footerInput, setFooterInput ] = useState<string>('');
  const [ isFeedbackShown, setFeedback ] = useState<boolean>(false);
  const [ emailAddress, setEmailAddress ] = useState<string>('');
  const copyrightRef = useRef<HTMLParagraphElement | null>(null);
  const [ error, setError ] = useState<string | null>(null);


  const subscribe = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(footerInput);

    if (!isEmailValid) {
      setError('Invalid email address');
      return;
    }

    devLog('info', 'SUCCESS', 'You are now subscribed to our newsletter!');
    setEmailAddress(footerInput);
    setFeedback(true);
  }


  useEffect(() => {
    const handleCopyrightPadding = () => {
      const copyrightElement = copyrightRef.current;
      if (!copyrightElement) return;

      if (isBtnVisible) {
        copyrightElement.style.paddingBottom = `${stickyBtnHeight + 15}px`;
      } else {
        setStickyBtnHeight(30);
        copyrightElement.style.paddingBottom = `${stickyBtnHeight}px`;
      }
    };

    handleCopyrightPadding();
  }, [stickyBtnHeight]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setFeedback(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isFeedbackShown]);


  return (
    <footer className="footer">
      <div className="newsletter-section-container">
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
                id="submit-email"
                aria-label="Email address"
                className="input footer-input"
                type="email" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => setFooterInput(e.target.value)}
                value={footerInput} 
                placeholder="Enter your email address"
              />

              <button className="subscribe-btn">Subscribe to Newsletter</button>
            </form>

            {error &&
              <div aria-live="assertive" className="edit-status error">{error}</div>
            }

            <p className="newsletter-notice">
              By subscribing, you agree to receive marketing communications from PROGRESSIO and partners by email. You also consent to the use of your details in accordance with our Privacy Policy.
            </p>

            <section className={`subscribe-feedback ${isFeedbackShown? 'shown' : ''}`}>
              <p>You successfully subscribed to our newsletter using {emailAddress}!</p> 
              <p>Expect upcoming deals, we always have something that might spark your interest!</p>
            </section>
          </div>
        </section>
      </div>

      <div className="links-social-wrapper">
        <FooterLinks />
        <SocialLinks />
      </div>

      <p ref={copyrightRef} className="copyrights">
        <small>&copy;</small> 2025 Progressio.com
      </p>
    </footer>
  )
};

export default Footer;