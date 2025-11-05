import { useThemeContext } from '../hooks/useThemeContext.ts';
import { useAuthContext } from '../hooks/useAuthContext.ts';
import { getLocalFavorites } from '../utils/localFavorites.ts';
import { getCart } from '../utils/cartStorage.ts';
import useCartContext from '../hooks/useCartContext.ts';

import { useAvatar } from '../context/AuthContext/AvatarContext.tsx';
import useFavoritesContext from '../hooks/useFavoritesContext.ts';
import type { Theme, ThemeIcon } from '../context/types.ts';
import { useEffect } from 'react';
import initializeAuth from '../services/initializeAuth.tsx';
import '../styles/index.css';


// app configurations

const appConfigs = () => {
  const { state, dispatch: authDispatch } = useAuthContext();
  const { setLocalCart } = useCartContext();
  const { setAvatar } = useAvatar();
  const { setLocalFavorites } = useFavoritesContext();
  const { dispatch: themeDispatch } = useThemeContext();


  useEffect(() => {
    const theme = (state?.user?.theme || localStorage.getItem('theme') || 'os-default') as Theme; 

    if (theme === 'os-default') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

      const applySystemTheme = () => {
        const newTheme = prefersDark.matches ? 'dark-mode' : 'light-mode';
        document.documentElement.className = newTheme;
      };

      applySystemTheme();

      prefersDark.addEventListener('change', applySystemTheme);
      return () => prefersDark.removeEventListener('change', applySystemTheme);
    } else {
      document.documentElement.className = theme;
    }

    if (state?.user?.theme) {
      localStorage.setItem('theme', state.user.theme);
    }

    themeDispatch({ 
      type: 'TOGGLE_THEME', 
      theme: theme, 
      themeIcon: (theme as Theme === 'os-default'? 'contrast' : theme.replace('-', '_')) as ThemeIcon
    });
  }, [state.isLoggedIn, state?.user?.theme]);



  useEffect(() => {
    const handleFavoritesStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const favs = getLocalFavorites();
        setLocalFavorites(favs);
      }
    }

    if (state.user) {
      const safeFav = Array.isArray(state.user.favorites) ? state.user.favorites : [];
      setLocalFavorites(safeFav);
      return;
    }

    window.addEventListener('storage', handleFavoritesStorage);
    return () => window.removeEventListener('storage', handleFavoritesStorage);
  }, [state.isLoggedIn]);



  useEffect(() => {
    const handleCartStorage = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const cart = getCart();
        setLocalCart(cart);
        return;
      }
    }
      
    if (state.user) {
      const safeCart = Array.isArray(state.user.cart) ? state.user.cart : [];
      setLocalCart(safeCart);
      return;
    }

    window.addEventListener('storage', handleCartStorage);
    return () => window.removeEventListener('storage', handleCartStorage);
  }, [state.isLoggedIn]);



  // initialize auth
  useEffect(() => {
    const auth = async () => {
      try {
        const result = await initializeAuth();
        if (!result.success) return;
  
        authDispatch({ type: 'LOGIN', payload: result.user });
      } catch (err) {
        return {
          success: false,
          message: err
        }
      }
    };
    
    auth();
  }, [state.isLoggedIn]);

  

  useEffect(() => {
    const getAvatar = async () => {
      if (!state.isLoggedIn || !state.user?._id || !state.user?.avatar) {
        return;
      }

      try {
        const { getAvatarService } = await import('../services/getAvatarService.tsx');
        const result = await getAvatarService(state.user._id);

        if (result?.success && result.avatar) {
          setAvatar(`data:image/png;base64,${result.avatar}`);
        } else {
          setAvatar(null);
        }
      } catch (err) {
        setAvatar(null);
      }
    };

    getAvatar();
  }, [state.isLoggedIn, state?.user?._id]);
};

export default appConfigs;

