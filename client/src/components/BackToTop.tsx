import { useEffect, useState } from 'react';
import ChevronUpIcon from '../images/icons/chevron-up-icon.svg?component';


const BackToTop = () => {
  const [ visible, setVisible ] = useState(false);

  useEffect(() => {
    const toggleVisibillity = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }

    window.addEventListener('scroll', toggleVisibillity);

    return () => window.removeEventListener('scroll', toggleVisibillity);
  }, []);


  return (
    <button
      aria-label="Go back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      data-visible={visible? 'true' : 'false'}
      className="material-symbols-outlined go-top-btn"
    >
      <ChevronUpIcon />
    </button>
  )
};

export default BackToTop;