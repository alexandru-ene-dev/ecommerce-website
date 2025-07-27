import { createContext } from "react";
import { type MenuContextType } from './menuContextTypes.ts';

// create MenuContext
export const MenuContext = createContext<MenuContextType | null>(null);