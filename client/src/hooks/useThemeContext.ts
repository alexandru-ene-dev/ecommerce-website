import { devLog } from "../utils/devLog";
import { Context } from "../context/Context";
import { useContext } from "react";

export const useThemeContext = () => {
  const context = useContext(Context);

  if (!context) {
    devLog(
      'error',
      'provider', 
      'useThemeContext must be used inside a <Provider />'
    );
    throw new Error(`useThemeContext must be used inside a <Provider />`);
  }
  
  return context;
};
