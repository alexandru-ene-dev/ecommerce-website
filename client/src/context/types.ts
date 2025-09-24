import type { ReactNode, Dispatch } from 'react';

export type Theme = 'os-default' | 'dark-mode' | 'light-mode';

export type StateType = {
  theme: Theme
  themeIcon: ThemeIcon
}

export type ThemeIcon = 'light_mode' | 'dark_mode' | 'contrast';

export type Action = { 
  type: 'TOGGLE_THEME',
  theme: Theme,
  themeIcon: ThemeIcon 
};

export type ContextType = {
  state: StateType,
  dispatch: Dispatch<Action>
}

export type Children = {
  children: ReactNode
}