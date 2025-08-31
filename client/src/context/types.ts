import type { ReactNode, Dispatch } from 'react';

export type Theme = 'os-default' | 'dark-mode' | 'light-mode';

export type StateType = {
  searchInput: string
  footerInput: string
  theme: Theme
  themeIcon: ThemeIcon
}

type ThemeIcon = 'light_mode' | 'dark_mode' | 'contrast';

export type Action =
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_FOOTER_INPUT'; payload: string }
  | { type: 'TOGGLE_THEME'; theme: Theme; themeIcon: ThemeIcon };

export type ContextType = {
  state: StateType,
  dispatch: Dispatch<Action>
}

export type Children = {
  children: ReactNode
}