import { createContext } from 'react';
import { type ContextType } from './types';

// create context
export const Context = createContext<ContextType | null>(null);