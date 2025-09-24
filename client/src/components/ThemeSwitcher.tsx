import { type ThemeSwitcherType } from "./types";
import { forwardRef, useRef, useEffect, useState } from "react";
import { type FunctionComponent, type SVGProps } from "react";
import LightIcon from '../images/icons/light-icon.svg'
import DarkIcon from '../images/icons/dark-icon.svg'
import ContrastIcon from '../images/icons/contrast-icon.svg'


const ThemeSwitcher = forwardRef<HTMLDivElement, ThemeSwitcherType>((
  {
    handleMenus,
    visibleThemeMenu,
    themeIcon,
    changeTheme
  }, ref
) => {
  const themeRef = useRef<HTMLButtonElement | null>(null);
  const [ ThemeIconSrc, setThemeIconSrc ] = 
    useState<FunctionComponent<SVGProps<SVGSVGElement>> | null>(null);


  useEffect(() => {
    const handleThemeIcon = async () => {
      switch(themeIcon) {
        case 'light_mode': {
          const iconSrc = await import('../images/icons/light-icon.svg?component');
          setThemeIconSrc(() => iconSrc.default);
          break;
        }

        case 'dark_mode': {
          const iconSrc = await import('../images/icons/dark-icon.svg?component');
          setThemeIconSrc(() => iconSrc.default);
          break;
        }

        case 'contrast': {
          const iconSrc = await import('../images/icons/contrast-icon.svg?component');
          setThemeIconSrc(() => iconSrc.default);
        }
      }
    };

    handleThemeIcon();
  }, [themeIcon]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      handleMenus('');

      const themeElement = themeRef.current;
      if (!themeElement) return;
      themeElement.focus();
    }
  }


  return (
    <div
      title="Theme" 
      ref={ref} onClick={() => handleMenus('theme')} 
      className="theme-switcher"
    >
      <button
        ref={themeRef} 
        className="theme-switcher-btn header-btn"
        aria-label="Theme"
        aria-controls="theme-menu" 
        aria-haspopup="menu" 
        aria-expanded={visibleThemeMenu? "true" : "false"
      }>
        {ThemeIconSrc && <ThemeIconSrc className="header-btn" />}
      </button>
      
      { visibleThemeMenu && 
        <div 
          role="menu" 
          onKeyDown={handleKeyDown} 
          id="theme-menu" 
          className="theme-list_wrapper"
        >
          <ul className="theme-list">
            <li className="theme-item">
              <button
                aria-label="Operating system theme" 
                role="menuitem" 
                data-theme="os-default" 
                onClick={changeTheme} 
                className="theme-btn"
              >
                <img src={ContrastIcon} />
                <span>OS</span>
              </button>
            </li>

            <li className="theme-item">
              <button 
                role="menuitem" 
                data-theme="light-mode" 
                onClick={changeTheme} 
                className="theme-btn"
              >
                <img src={LightIcon} />
                <span>Light</span>
              </button>
            </li>

            <li className="theme-item">
              <button 
                role="menuitem" 
                data-theme="dark-mode" 
                onClick={changeTheme} 
                className="theme-btn"
              >
                <img src={DarkIcon} />
                <span>Dark</span>
              </button>
            </li>
          </ul>
        </div>
      }
    </div>
  );
});

export default ThemeSwitcher;