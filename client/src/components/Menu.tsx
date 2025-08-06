// import { useState } from 'react';
import { categories, type Category } from '../utils/categories.ts';
import { useMenuContext } from '../hooks/useMenuContext.ts';

const Menu = (
  { visibleMenu, closeModal }: {
    visibleMenu: boolean,
    closeModal: () => void 
  }) => {

  const { state, dispatch } = useMenuContext();

  const handleSelectCategory = (category: Category) => {
    dispatch({ type: 'SET_VIEW', payload: 'subcategory' });
    dispatch({ type: 'SET_CATEGORY', payload: category });
  }

  const handleBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'menu' });
    dispatch({ type: 'SET_CATEGORY', payload: null });
  };

  const closeEverything = () => {
    closeModal();
    dispatch({ type: 'SET_VIEW', payload: 'menu' });
    dispatch({ type: 'SET_CATEGORY', payload: null });
  };

  return (
    <div className="modal" data-visible={visibleMenu? "true" : "false"}>
      <div className="mobile-menu" data-visible={visibleMenu? "true" : "false"}>
        {/* <div className="relative-menu-wrapper"> */}
          {state.view === 'menu' && (
            <ul className="products-categories-list">
              {categories.map((category, index) => {
                return (
                  <li 
                    key={index} 
                    className="product-category" 
                    onClick={() => handleSelectCategory(category)}>
                    <a href="#" className="product-category-name">{category.title}</a>
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
              <button className="back-menu-btn" onClick={handleBack}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              <h2 className="selected-category-title">
                { state.selectedCategory && state.selectedCategory.title }
              </h2>
            </div>
          
            <ul className="product-subcategory-list">
              {state.selectedCategory && state.selectedCategory.subcategories.map((sub, subIndex) => (
                <li className="subcategory-item" key={subIndex}>
                  <a className="subcategory-name" href="#">{sub}</a>
                </li>
              ))}
            </ul>
          </div>
          {/* <button className="close-menu-btn" onClick={closeEverything}>Close</button> */}
        {/* </div> */}

        <button className="close-menu-btn" onClick={closeEverything}>Close</button>
      </div>
    </div>
  );
};

export default Menu;