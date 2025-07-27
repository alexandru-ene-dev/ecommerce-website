import { useReducer } from "react";
import { MenuContext } from "./MenuContext";
import { type MenuChildren, type MenuState } from "./menuContextTypes.ts";
import { menuReducer } from './menuReducer.ts';

const initialState: MenuState = {
  view: 'menu',
  selectedCategory: null,
};

// create MenuProvider
export const MenuProvider = ({ children }: MenuChildren) => {
  const [ state, dispatch ] = useReducer(menuReducer, initialState);

  return (
    <MenuContext.Provider value={{ state, dispatch }}>
      { children }
    </MenuContext.Provider>
  );
};