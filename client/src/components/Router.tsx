import { Route, Routes } from 'react-router-dom';
import Homepage from '../pages/Homepage.tsx';
import NotFound from '../pages/NotFound.tsx';
import Register from '../pages/RegisterPage.tsx';
import Favorites from '../pages/Favorites.tsx';

import Cart from '../pages/Cart.tsx';
import About from '../pages/About.tsx';
import Profile from '../pages/Profile.tsx';
import ProductPage from '../pages/ProductPage.tsx';
import Goodbye from '../pages/Goodbye.tsx';

import CategoryPage from '../pages/CategoryPage.tsx';
import LoginPage from '../pages/LoginPage.tsx';
import SearchPage from '../pages/SearchPage.tsx';


const Router = (
  { setStickyBtnHeight, setIsBtnVisible }: 
  {
    setStickyBtnHeight: React.Dispatch<React.SetStateAction<number>>,
    setIsBtnVisible: React.Dispatch<React.SetStateAction<boolean>>
  }
) => {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/register' element={<Register />} />
      <Route path='/favorites' element={<Favorites />} />

      <Route path='/cart' element={<Cart />} />
      <Route path='/about' element={<About />} />
      <Route path='/login' element={<LoginPage />} />
      
      <Route path='/products/:name' element={
        <ProductPage 
          setIsBtnVisible={setIsBtnVisible} 
          setStickyBtnHeight={setStickyBtnHeight}  
        />
      }/>

      <Route path='/search' element={<SearchPage />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/goodbye' element={<Goodbye />} />
      <Route path='/categories/:subcategory/:subSubcategory?' element={<CategoryPage />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default Router;