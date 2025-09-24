import { type ReactNode, type Dispatch } from 'react';
import { type Theme } from '../types';

export type UserType = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  favorites?: [],
  cart?: []
  avatar?: string,
  theme?: Theme
};

export type AuthContextType = {
  state: AuthStateType,
  dispatch: Dispatch<AuthActionsType>
};

export type AuthStateType = {
  user: UserType | null,
  isLoggedIn: boolean
}

export type AuthChildrenType = {
  children: ReactNode
}

export type AuthActionsType = 
  | { type: 'LOGIN', payload: UserType }
  | { type: 'LOGOUT', payload: null }
  | { type: 'EDIT_NAME', payload: { firstName: string, lastName: string } };
;