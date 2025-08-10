import { AuthContext } from "../context/AuthContext/AuthContext";
import { useContext } from "react";
import { devLog } from "../utils/devLog";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    devLog(
      'error',
      'provider', 
      'useAuthContext must be used inside a <Provider />'
    );
    throw new Error(`useAuthContext must be used inside a <Provider />`);
  }

  return context;
};

