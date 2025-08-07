import Main from "../components/Main";
import { type Dispatch, type SetStateAction } from 'react';

const Homepage = (
  { 
    setIsBtnVisible,
    // isHeaderVisible,
    // setIsHeaderVisible,
    // headerHeight,
    // setHeaderHeight
  }: 
  {
    setIsBtnVisible: Dispatch<SetStateAction<boolean>>,
    // isHeaderVisible: boolean,
    // setIsHeaderVisible: Dispatch<SetStateAction<boolean>>,
    // headerHeight: number,
    // setHeaderHeight: Dispatch<SetStateAction<number>>
  }
) => {
  return (
    <Main 
      setIsBtnVisible={setIsBtnVisible}
      // isHeaderVisible={isHeaderVisible}
      // setIsHeaderVisible={setIsHeaderVisible}
      // headerHeight={headerHeight}
      // setHeaderHeight={setHeaderHeight}
    />
  )
};

export default Homepage