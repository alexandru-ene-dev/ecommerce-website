import { categories } from "../utils/categories";
import { Link } from 'react-router-dom';
import { type Dispatch, type MouseEvent, type SetStateAction } from "react";
import LazyProductImage from "./LazyProductImage";


const DesktopMenu = (
  {
    setVisibleHeader,
    activeIndex,
    setActiveIndex
  }:
  {
    setVisibleHeader: Dispatch<SetStateAction<boolean>>,
    activeIndex: number | null,
    setActiveIndex: Dispatch<SetStateAction<number | null>>
  }
) => {

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
    const isActive = activeIndex === i;

    return (
      <li 
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseOut}
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
                      onFocus={() => setVisibleHeader(true)}
                      onClick={handleSublinkClick} 
                      className="sublink" 
                      to={`/categories/${sub.slug}`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <LazyProductImage 
                imageName={cat.src} 
                alt={cat.alt} 
                className={"desktop-link-img"}
              />
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