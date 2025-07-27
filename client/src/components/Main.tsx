import Deal from './Deal.tsx';
import { type DealProps } from './Deal'; 
import images from '../assets/images/images.json';
import { type MouseEvent, useRef, useEffect } from 'react';

const Main = () => {
  const dealSlideRef = useRef<HTMLUListElement>(null);
  const dealElements = images.map(({ text, src, alt, active, id }: DealProps) => {
    const imageUrl = new URL(`../assets/images/${src}`, import.meta.url).href;

    return (
      <Deal
        key={id}
        text={text}
        src={imageUrl}
        alt={alt}
        active={active} 
        id={id}
      />
    )
  });

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
    }, 13000);
    
    return () => clearTimeout(interval);
  }, []);


  return (
    <>
      <h1 className="title">
        Future is here! Explore latest tech with smartest prices.
      </h1>
      <main>
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
      </main>
    </>
  );
};

export default Main