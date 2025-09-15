import { useTypewriter } from "../hooks/useTypewriter.ts";
import { Link } from 'react-router-dom';
import { type DealsType } from "../utils/deals.ts";
import deals from '../utils/deals.ts';
import { type MouseEvent } from "react";
import { useRef, useEffect } from 'react';


const Deals = () => {
  const dealSlideRef = useRef<HTMLUListElement>(null);


  const changeSlide = (e: MouseEvent<HTMLButtonElement>): void => {
    const target = e.currentTarget as HTMLButtonElement;
    const container = dealSlideRef.current;
    const direction = target.dataset.direction;

    if (!container) return;

    const slideWidth = container.clientWidth;
    const maxScroll = container.scrollWidth - slideWidth;
    const currentScroll = container.scrollLeft;

    if (direction === 'right') {
      if (currentScroll >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: slideWidth, behavior: 'smooth' });
      }
    } else if (direction === 'left') {
      if (currentScroll <= 0) {
        container.scrollTo({ left: maxScroll, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: -slideWidth, behavior: 'smooth' });
      }
    }
  };


  useEffect(() => {
      const interval = setInterval(() => {
        const container = dealSlideRef.current;
        if (!container) return;
        
        const slideWidth = container.clientWidth;
        const maxScroll = container.scrollWidth - slideWidth;
        const currentScroll = container.scrollLeft;
        
        if (currentScroll >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: slideWidth, behavior: 'smooth' });
        }
      }, 5000); 
      return () => clearTimeout(interval);
    }, []);


  const dealElements = deals.map((
    { text, src, alt, url, sale, id }: DealsType
  ) => {
    const imageUrl = new URL(`../assets/images/${src}`, import.meta.url).href;
    const typedText = useTypewriter(text, 50);

    return (
      <li key={id} className="deal-item">
        <Link to={`${url}?sale=${sale}`}>
          <p className="deal-text">{typedText}</p>

          <div className="deal-image-wrapper">
            <img
              className="deal-img"
              src={imageUrl} 
              alt={alt} 
            />
          </div>
        </Link>
      </li>
    );
  });

  return (
    <section className="new-deals-section">
      <div className="controllers-wrapper">
        <button data-direction="left" onClick={changeSlide} className="controller left-controller">
          <span className="controller-icon">&#8678;</span>
        </button>

        <button data-direction="right" onClick={changeSlide}className="controller right-controller">
          <span className="controller-icon">&#8680;</span>
        </button>
      </div>

      <ul ref={dealSlideRef} className="deals-list">
        {dealElements}
      </ul>
    </section>
  );
};

export default Deals;