import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useLocation } from 'react-router-dom'


const HandlePadding = (
  { setStickyBtnHeight, setIsBtnVisible }: 
  { 
    setStickyBtnHeight: Dispatch<SetStateAction<number>>
    setIsBtnVisible: Dispatch<SetStateAction<boolean>> 
  }
) => {
  const { pathname } = useLocation();

  useEffect(() => {
    setStickyBtnHeight(30);
    setIsBtnVisible(false);
  }, [pathname]);

  return null
};

export default HandlePadding;