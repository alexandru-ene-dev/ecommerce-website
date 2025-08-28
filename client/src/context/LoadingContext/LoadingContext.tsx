import { 
  createContext, 
  useState, 
  type Dispatch, 
  type ReactNode, 
  type SetStateAction 
} from 'react';

type LoadingContextType = {
  isLoading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>
};

type LoadingContextChildren = {
  children: ReactNode
};

export const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: LoadingContextChildren) => {
  const [ isLoading, setLoading ] = useState(false);

  const value = { isLoading, setLoading };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};