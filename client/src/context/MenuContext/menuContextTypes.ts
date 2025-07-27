import { type Dispatch, type ReactNode } from "react"
import { type Category } from "../../utils/categories";

export type MenuActions = 
  | { type: 'SET_VIEW', payload: 'menu' | 'subcategory' }
  | { type: 'SET_CATEGORY', payload: Category | null }

export type MenuState = {
  view: 'menu' | 'subcategory'
  selectedCategory: Category | null
};

export type MenuContextType = {
  state: MenuState
  dispatch: Dispatch<MenuActions>
}

export type MenuChildren = {
  children: ReactNode
}