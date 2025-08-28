import { LoadingContext } from "../context/LoadingContext/LoadingContext";
import { useContext } from 'react';

const useLoadingContext = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('LoadingContext must be used inside a Provider');
  }

  return context;
};

export default useLoadingContext;