import { devLog } from "../utils/devLog";
import { Context } from "../context/Context";
import { useContext } from "react";

export const useInputContext = () => {
  const context = useContext(Context);
  if (!context) {
    devLog(
      'error',
      'provider', 
      'useInputContext must be used inside a <Provider />'
    );
    throw new Error(`useInputContext must be used inside a <Provider />`);
  }
  return context;
};
