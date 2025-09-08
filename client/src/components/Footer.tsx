import { type ChangeEvent, type FormEvent, useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useInputContext } from "../hooks/useInputContext";
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
  const { state, dispatch } = useInputContext();
  const [ isFeedbackShown, setFeedback ] = useState<boolean>(false);
  const [ emailAddress, setEmailAddress] = useState<string>('');
  const copyrightRef = useRef<HTMLParagraphElement>(null);


  const subscribe = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    devLog('info', 'SUCCESS', 'You are now subscribed to our newsletter!');
    setEmailAddress(state.footerInput);
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
                className="input footer-input"
                type="email" 
                onChange={(e: ChangeEvent<HTMLInputElement>) => dispatch({
                  type: "SET_FOOTER_INPUT",
                  payload: e.target.value
                })} 
                value={state.footerInput} 
                placeholder="Enter your email address"
              />

              <button className="subscribe-btn">Subscribe to Newsletter</button>
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