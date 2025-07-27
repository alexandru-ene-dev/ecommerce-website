import type { MenuActions, MenuState } from "./menuContextTypes.ts";

export const menuReducer = (state: MenuState, action: MenuActions) => {
  switch(action.type) {
    case 'SET_VIEW': {
      return { ...state, view: action.payload };
    }
    case 'SET_CATEGORY': {
      return { ...state, selectedCategory: action.payload };
    }
    default: 
      return state;
  }
};