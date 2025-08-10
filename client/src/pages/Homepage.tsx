import Main from "../components/Main";
import { type Dispatch, type SetStateAction } from 'react';

const Homepage = (
  { setIsBtnVisible }: 
  { setIsBtnVisible: Dispatch<SetStateAction<boolean>> }
) => {
  return (
    <Main setIsBtnVisible={setIsBtnVisible} />
  );
};

export default Homepage