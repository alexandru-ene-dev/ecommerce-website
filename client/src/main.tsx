import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { ContextProvider } from './context/Provider.tsx';

import { MenuProvider } from './context/MenuContext/MenuProvider.tsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';
import { LoadingProvider } from './context/LoadingContext/LoadingContext.tsx';
import { CartProvider } from './context/CartContext.tsx';

import { AvatarProvider } from './context/AuthContext/AvatarContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ContextProvider>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <MenuProvider>
                <LoadingProvider>
                  <AvatarProvider>
                    <App />
                  </AvatarProvider>
                </LoadingProvider>
              </MenuProvider>
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ContextProvider>
    </Router>
  </StrictMode>,
)
