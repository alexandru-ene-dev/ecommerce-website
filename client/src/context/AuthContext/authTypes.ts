import { type ReactNode, type Dispatch } from 'react';

export type UserType = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  favorites: [],
  cart: []
  avatar: string
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
  // type: 'LOGIN' | 'LOGOUT' | 'EDIT_NAME',
  // payload: UserType | null | { firstName: string, lastName: string }

  | { type: 'LOGIN', payload: UserType }
  | { type: 'LOGOUT', payload: null }
  | { type: 'EDIT_NAME', payload: { firstName: string, lastName: string } };
;