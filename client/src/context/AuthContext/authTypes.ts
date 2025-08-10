import { type ReactNode, type Dispatch } from 'react';

export type UserType = {
  _id: string,
  firstName: string,
  lastName: string,
  email: string,
  favorites: number[]
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

export type AuthActionsType = {
  type: 'LOGIN' | 'LOGOUT',
  payload: UserType
};