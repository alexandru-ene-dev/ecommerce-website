import { AuthContext } from "./AuthContext.tsx";
import { useReducer } from 'react';
import authReducer from './authReducer.ts';
import type { AuthStateType, AuthChildrenType } from './authTypes.ts'


const initialState: AuthStateType = {
  user: null,
  isLoggedIn: false
};

export const AuthProvider = ({ children }: AuthChildrenType) => {
  const [ state, dispatch ] = useReducer(authReducer, initialState);

  const value = { state, dispatch }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>  
  );
}