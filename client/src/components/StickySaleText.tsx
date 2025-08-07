import { salesText } from '../utils/salesText.ts';
import { 
  useState, useRef, useEffect,
  type Dispatch, type SetStateAction 
} from 'react';

const StickySaleText = (
  {
    // isHeaderVisible,
    // setIsHeaderVisible,
    // headerHeight,
    // setHeaderHeight,
    // isDesktopHeadVisible,
    // setDesktopHeadVisible,
    // desktopHeadHeight,
    // setDesktopHeadHeight
  }:
  {
    // isHeaderVisible: boolean,
    // setIsHeaderVisible: Dispatch<SetStateAction<boolean>>,
    // headerHeight: number,
    // setHeaderHeight: Dispatch<SetStateAction<number>>,
    // isDesktopHeadVisible: boolean,
    // setDesktopHeadVisible: Dispatch<SetStateAction<boolean>>,
    // desktopHeadHeight: number,
    // setDesktopHeadHeight: Dispatch<SetStateAction<number>>,
  }
) => {
  const salesTextOuterRef = useRef<HTMLDivElement>(null);
  const saleTextWrapper = useRef<HTMLDivElement>(null);
  const saleIndexRef = useRef<number>(1);
  const slideWidthRef = useRef<number>(0);
  const totalSlidesRef = useRef<number>(0);
  const isSaleTransitioning = useRef(false);

  const moveSaleSlide = (index: number) => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    wrapper.style.transition = 'transform 500ms';
    wrapper.style.transform = 
      `translateX(-${slideWidthRef.current * index}px)`;
  };

  // sale text button handlers
  const handlePrev = () => {
    if (isSaleTransitioning.current === true) return;
    isSaleTransitioning.current = true;

    if (!saleTextWrapper.current) return;
    saleIndexRef.current -= 1;
    moveSaleSlide(saleIndexRef.current);
  };

  const handleNext = () => {
    if (isSaleTransitioning.current === true) return;
    isSaleTransitioning.current = true;
    
    if (!saleTextWrapper.current) return;
    saleIndexRef.current += 1;
    moveSaleSlide(saleIndexRef.current);
  };


  // sale text window resize issue fix
  useEffect(() => {
    const handleResize = () => {
      const wrapper = saleTextWrapper.current;
      if (!wrapper) return;

      const slides = wrapper.querySelectorAll('a');
      const slideWidth = slides[0].offsetWidth || 0;
      slideWidthRef.current = slideWidth;

      wrapper.style.transition = 'none';
      wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    if (wrapper.dataset.cloned === 'true') return;

    const slides = wrapper.querySelectorAll('a');
    const slideWidth = slides[0].offsetWidth || 0;
    slideWidthRef.current = slideWidth;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    wrapper.append(firstClone);
    wrapper.prepend(lastClone);
    wrapper.dataset.cloned = 'true';

    const allSlides = wrapper.querySelectorAll('a');
    totalSlidesRef.current = allSlides.length;

    wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
  }, []);
  
  
  // transitionend handler & sale text auto slide
  useEffect(() => {
    const wrapper = saleTextWrapper.current;
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll('a');
    const slideWidth = slides[0].offsetWidth;

    const interval = setInterval(() => {
      if (isSaleTransitioning.current === true) return;
      isSaleTransitioning.current = true;

      saleIndexRef.current += 1;
      wrapper.style.transition = 'transform 500ms';
      wrapper.style.transform = `translateX(-${slideWidth * saleIndexRef.current}px)`;
    }, 4000);
    
    const handleTransitionEnd = () => {
      const total = totalSlidesRef.current;
      wrapper.style.transition = 'none';
      
      if (saleIndexRef.current >= total - 1) {
        saleIndexRef.current = 1;
        
        wrapper.style.transform =
          `translateX(-${slideWidthRef.current * saleIndexRef.current}px)`;
        
        setTimeout(() => {
          wrapper.style.transition = 'transform 500ms';
        }, 20);
      }
      
      if (saleIndexRef.current <= 0) {
        saleIndexRef.current = total - 2;
        
        wrapper.style.transform =
          `translateX(-${slideWidthRef.current * saleIndexRef.current}px)`;
        
        setTimeout(() => {
          wrapper.style.transition = 'transform 500ms';
        }, 20);
      }

      isSaleTransitioning.current = false;
    };

    wrapper.addEventListener('transitionend', handleTransitionEnd);
    return () => {
      clearInterval(interval);
      wrapper.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);



  // handle mobile sticky text slide margin from header
  // useEffect(() => {
  //   const handleStickyTextMargin = () => {
  //     const saleWrapper = salesTextOuterRef.current;
  //     if (!saleWrapper) return;

  //     if (isHeaderVisible) {
  //       saleWrapper.style.transition = 'transform 300ms';
  //       saleWrapper.style.transform = `translateY(${headerHeight}px)`;
  //     } 
      
  //     else {
  //       saleWrapper.style.transform = `translateY(${0}px)`;
  //     }
  //   }

  //   handleStickyTextMargin();
  // }, [isHeaderVisible]);


// handle desktop sticky text slide margin from header
  // useEffect(() => {
  //   const handleStickyTextMargin = () => {
  //     const saleWrapper = salesTextOuterRef.current;
  //     if (!saleWrapper) return;

  //     if (isDesktopHeadVisible) {
  //       saleWrapper.style.transition = 'transform 300ms';
  //       saleWrapper.style.transform = `translateY(${desktopHeadHeight}px)`;
  //     } 
      
      // else {
      //   saleWrapper.style.transform = `translateY(${0}px)`;
      // }
    // }

  //   handleStickyTextMargin();
  // }, [isDesktopHeadVisible]);

  return (
    <div ref={salesTextOuterRef} className="sales-outer-wrapper">
      <div className="sales-inner-wrapper">
        <button onClick={handlePrev} data-dir="prev">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <button onClick={handleNext} data-dir="next">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      
        <div className="sales-width-wrapper">
          <div ref={saleTextWrapper} className="sales-text">
            {salesText.map((txt, i) => <a href="#" key={i}>{txt}</a>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StickySaleText;