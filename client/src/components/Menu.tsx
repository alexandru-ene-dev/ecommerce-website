// import { useState } from 'react';
import { categories, type Category } from '../utils/categories.ts';
import { useMenuContext } from '../hooks/useMenuContext.ts';
import delay from '../utils/delay.ts';
import { Link } from 'react-router-dom';


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
    <div className="modal" data-visible={visibleMenu? "true" : "false"}>
      <div className="mobile-menu" data-visible={visibleMenu? "true" : "false"}>
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

          {state.view === 'subcategory' && <button className='close-menu-btn' onClick={closeEverything}>Close</button>}
        </div>

        {state.view === 'menu' && <button className='close-menu-btn' onClick={closeEverything}>Close</button>}
      </div>
    </div>
  );
};

export default Menu;