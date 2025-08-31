import type { AuthStateType, AuthActionsType } from "./authTypes";

const authReducer = (state: AuthStateType, action: AuthActionsType ) => {
  switch(action.type) {
    case 'LOGIN':
      return { ...state, isLoggedIn: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, user: null };
    case 'EDIT_NAME':
      return {
        ...state, user: {
          ...state.user,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName
        } 
      };
    default:
      return state;
  }
}

export default authReducer;