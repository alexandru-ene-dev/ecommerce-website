import { categories, type Category } from '../utils/categories.ts';
import { useMenuContext } from '../hooks/useMenuContext.ts';
import delay from '../utils/delay.ts';
import { Link } from 'react-router-dom';
import useIsMobile from '../hooks/useIsMobile.ts';
import { forwardRef } from 'react';
import ChevronLeftIcon from '../images/icons/chevron-left-icon.svg?component';
import ChevronRightIcon from '../images/icons/chevron-right-icon.svg?component';


type MobileMenuPropsType = {
  handleMenus: (menu: string) => void,
  visibleMobileMenu: boolean,
  closeModal: () => void 
};


const MobileMenu =  forwardRef<HTMLDivElement, MobileMenuPropsType>((
  { 
    handleMenus,
    visibleMobileMenu,
    closeModal 
  }, ref
) => {
  const { state, dispatch } = useMenuContext();
  const isMobile = useIsMobile();


  const handleSelectCategory = (category: Category) => {
    dispatch({ type: 'SET_VIEW', payload: 'subcategory' });
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }


  const handleBack = async () => {
    await delay(30);
    dispatch({ type: 'SET_VIEW', payload: 'menu' });
    await delay(30);
    dispatch({ type: 'SET_CATEGORY', payload: null });
  };


  const closeEverything = async () => {
    closeModal();
    await delay(30);
    dispatch({ type: 'SET_VIEW', payload: 'menu' });
    dispatch({ type: 'SET_CATEGORY', payload: null });
  };
  

  return (
    <div 
      ref={ref} 
      className="hamburger-menu-wrapper"
    >
      <button
        aria-label={visibleMobileMenu ? 'Close menu' : 'Open menu'}
        aria-expanded={visibleMobileMenu ? 'true' : 'false'}
        aria-controls="mobile-menu" 
        data-closed-icon={visibleMobileMenu? 'true' : 'false'}
        className="hamburger-btn" 
        onClick={() => handleMenus('mobileMenu')}
      >
        <div className="hamburger">
          <span className="hamburger-line ham-line1"></span>
          <span className="hamburger-line ham-line2"></span>
          <span className="hamburger-line ham-line3"></span>
        </div>
      </button>
    

      {isMobile && 
        <div
          inert={!visibleMobileMenu ? true : undefined} 
          className="modal" 
          data-visible={visibleMobileMenu? "true" : "false"}
        >
          <div 
            id="mobile-menu" 
            className="mobile-menu"
            role="navigation" 
            data-visible={visibleMobileMenu? "true" : "false"}
          >
            {state.view === 'menu' && (
              <ul className="products-categories-list">
                {categories.map((category, index) => {
                  return (
                    <li key={index} className="product-category">
                      <button 
                        className="product-category-name"
                        onClick={() => handleSelectCategory(category)}
                      >
                        {category.title}
                        <ChevronRightIcon />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className={
              (state.view === 'subcategory' && state.selectedCategory)?
                "subcategory-view open" : "subcategory-view"
            }>
              <div className="back-title-flex">
                <button 
                  aria-label="Go back to main menu" 
                  className="back-menu-btn" 
                  onClick={handleBack}
                >
                  <ChevronLeftIcon />
                </button>

                <h2 className="selected-category-title">
                  { state?.selectedCategory?.title }
                </h2>
              </div>
            
              <ul className="product-subcategory-list">
                {state?.selectedCategory?.subcategories.map((sub, subIndex) => (
                  <li className="subcategory-item" key={subIndex}>
                    <Link onClick={closeModal} className="subcategory-name" to={`/categories/${sub.slug}`}>
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>        
            </div>

            <button 
              className={
                `close-menu-btn 
                ${state.view === 'subcategory' && state.selectedCategory && "sub"}`
              } 
              onClick={closeEverything}
            >
              Close
            </button>
          </div>
        </div>
      }
    </div>
  );
});

export default MobileMenu;