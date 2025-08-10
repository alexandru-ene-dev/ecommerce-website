import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter as Router } from 'react-router-dom';
import { ContextProvider } from './context/Provider.tsx';
import { MenuProvider } from './context/MenuContext/MenuProvider.tsx';
import { AuthProvider } from './context/AuthContext/AuthProvider.tsx';
import { FavoritesProvider } from './context/FavoritesContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <ContextProvider>
        <AuthProvider>
          <FavoritesProvider>
            <MenuProvider>
              <App />
            </MenuProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ContextProvider>
    </Router>
  </StrictMode>,
)
