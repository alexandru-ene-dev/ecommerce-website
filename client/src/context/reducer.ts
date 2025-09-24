import type { StateType, Action } from "./types";

export const reducer = (state: StateType, action: Action): StateType => {
  switch (action.type) {
    case "TOGGLE_THEME":
      return { ...state, theme: action.theme, themeIcon: action.themeIcon };
    default:
      return state;
  }
}