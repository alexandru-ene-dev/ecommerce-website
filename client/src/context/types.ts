import type { ReactNode, Dispatch } from 'react';

export type Theme = 'os_default' | 'dark_mode' | 'light_mode';

export type StateType = {
  searchInput: string
  footerInput: string
  theme: Theme
}

type Actions = 
  'SET_SEARCH_INPUT' | 'SET_FOOTER_INPUT' | 'TOGGLE_THEME';

export type ActionsType = { 
  type: Actions,
  payload: string
};

export type ContextType = {
  state: StateType,
  dispatch: Dispatch<ActionsType>
}

export type Children = {
  children: ReactNode
}