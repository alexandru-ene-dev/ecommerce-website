import { useEffect, useState } from 'react';

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
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      data-visible={visible? 'true' : 'false'}
      className="material-symbols-outlined go-top-btn"
    >
      keyboard_control_key
    </button>
  )
};

export default BackToTop;