import { useState, useEffect } from 'react';

export const useTypewriter = (
  text: string, 
  speed: number = 50, 
  loop: boolean = true
) => {
  const [ displayedText, setDisplayedText ] = useState('');
  const [ charIndex, setCharIndex ] = useState(0);

  useEffect(() => {
    if (charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text.charAt(charIndex));
        setCharIndex(i => i + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (loop) {
      const reset = setTimeout(() => {
        setDisplayedText('');
        setCharIndex(0);
      }, 3000);

      return () => clearTimeout(reset);
    }
  }, [text, speed, charIndex, loop]);

  return displayedText;
}