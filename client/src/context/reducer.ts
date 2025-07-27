import type { StateType, ActionsType, Theme } from "./types";

export const reducer = (state: StateType, action: ActionsType): StateType => {
  switch (action.type) {
    case "SET_SEARCH_INPUT":
      return { ...state, searchInput: action.payload };
    case "SET_FOOTER_INPUT":
      return { ...state, footerInput: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: action.payload as Theme };
    default:
      return state;
  }
}