import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import BackToTop from './components/BackToTop.tsx';
import ScrollToHash from './components/ScrollToHash.tsx';
import appConfigs from './components/AppConfigs.ts';

import LoaderLine from './components/LoaderLine.tsx';
import HandlePadding from './components/HandlePadding.tsx';
import ScrollTop from './components/ScrollTop.tsx';
import Router from './components/Router.tsx';
import { useState } from 'react';


function App() {
  // sticky button on product page
  const [ isBtnVisible, setIsBtnVisible ] = useState(false);
  const [ stickyBtnHeight, setStickyBtnHeight ] = useState(30);

  appConfigs();
  

  return (
    <>
      <Header />
      <ScrollToHash />
      <ScrollTop />

      <LoaderLine />
      <HandlePadding 
        setStickyBtnHeight={setStickyBtnHeight}
        setIsBtnVisible={setIsBtnVisible}
      />

      <Router 
        setStickyBtnHeight={setStickyBtnHeight}
        setIsBtnVisible={setIsBtnVisible}
      />

      <BackToTop />

      <Footer 
        isBtnVisible={isBtnVisible} 
        stickyBtnHeight={stickyBtnHeight} 
        setStickyBtnHeight={setStickyBtnHeight}  
      />
    </>
  )
}

export default App
