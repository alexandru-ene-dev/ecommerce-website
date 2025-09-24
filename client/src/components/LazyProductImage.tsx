import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';


// Preload all images from the folder
const imageMap = import.meta.glob('../images/*.{jpg,jpeg,png,webp}', { import: 'default' });

const LazyProductImage = ({
  imageName,
  alt,
  className,
  name
}: {
  imageName: string | undefined,
  alt: string | undefined,
  className?: string,
  name?: string
}) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ imgSrc, setImgSrc ] = useState<string | null>(null);

  useEffect(() => {
    if (inView) {
      const path = `../images/${imageName}`;
      const loader = imageMap[path];

      if (loader) {
        Promise.resolve(loader()).then((module) => {
          setImgSrc(module as string);
        });
      } 
    }
  }, [inView, imageName]);


  return (
    <div ref={ref} className="lazy-img-wrapper">
      {imgSrc && <img 
        data-name={name} 
        className={className} 
        src={imgSrc} 
        alt={alt} 
        loading="lazy" 
      />}
    </div>
  );
};

export default LazyProductImage;
