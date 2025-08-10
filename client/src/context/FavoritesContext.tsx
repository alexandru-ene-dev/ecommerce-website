import { 
  type Dispatch, createContext, type ReactNode, 
  type SetStateAction, useState, useMemo, useEffect
} from "react";
import type { NewProductType } from "../components/types";
import { getLocalFavorites } from "../utils/localFavorites";


type FavoritesContextType = {
  localFavorites: NewProductType[],
  setLocalFavorites: Dispatch<SetStateAction<NewProductType[]>>
};


export const FavoritesContext = createContext<FavoritesContextType | null>(null);


export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [ localFavorites, setLocalFavorites ] = useState<NewProductType[]>([]);

  useEffect(() => {
    const favs = getLocalFavorites();
    setLocalFavorites(favs);
  }, []);

  const value = useMemo(() => ({ localFavorites, setLocalFavorites }), [localFavorites]);
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};