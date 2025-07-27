import { Context } from "./Context";
import { useMemo, useReducer } from 'react';
import { type StateType, type Children } from "./types";
import { reducer } from './reducer';

const initialState: StateType = {
  searchInput: '',
  footerInput: '',
  theme: 'os_default',
};

// create provider
export const ContextProvider = ({ children }: Children) => {
  const [ state, dispatch ] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};
