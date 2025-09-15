import { categories } from "../utils/categories";
import { Link } from 'react-router-dom';
import { type MouseEvent, useState } from "react";


const DesktopMenu = () => {
  const [ activeIndex, setActiveIndex ] = useState<number | null>(null);


  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseClick = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const handleMouseOut = () => {
    setActiveIndex(null);
  };

  const handleSublinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur();
    setActiveIndex(null);
  }; 

  const categoryElements = categories.map((cat, i) => {
    const imgSrc = new URL(`../assets/images/${cat.src}`, import.meta.url).href;
    const isActive = activeIndex === i;

    return (
      <li 
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseOut}
        // onFocus={() => handleMouseEnter(i)}
        onClick={() => handleMouseClick(i)}
        key={i} 
        className="desktop-nav_item"
      >
        <a className="desktop-nav_link" href="#">{cat.title}</a>
        
        {isActive && (
          <div className="desktop-nav_link-card">
            <div className="link-card-wrapper">
              <ul className="desktop-nav_sub-list">
                {cat.subcategories.map((sub, index) => (
                  <li key={index} className="subcategory-item">
                    <Link
                      onClick={handleSublinkClick} 
                      className="sublink" 
                      to={`/categories/${sub.slug}`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <img src={imgSrc} alt={cat.alt} />
            </div>
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="desktop-nav">
      <ul className="desktop-nav_list">{categoryElements}</ul>
    </div>
  );
};

export default DesktopMenu;