import type { StateType, Action } from "./types";

export const reducer = (state: StateType, action: Action): StateType => {
  switch (action.type) {
    case "SET_SEARCH_INPUT":
      return { ...state, searchInput: action.payload };
    case "SET_FOOTER_INPUT":
      return { ...state, footerInput: action.payload };
    case "TOGGLE_THEME":
      return { ...state, theme: action.theme, themeIcon: action.themeIcon };
    default:
      return state;
  }
}