import { type ThemeSwitcherType } from "./types";


const ThemeSwitcher = (
  {
    toggleThemeMenu,
    visibleThemeMenu,
    themeIcon,
    changeTheme
  }: ThemeSwitcherType
) => {

  return (
    <div onClick={toggleThemeMenu} className="theme-switcher">
      <button 
        className="theme-switcher-btn header-btn" 
        aria-haspopup="menu" 
        aria-expanded={visibleThemeMenu? "true" : "false"
      }>
        <span className="material-symbols-outlined header-btn-icon">{themeIcon}</span>
      </button>
      { visibleThemeMenu && <ul className="theme-list">
        <li className="theme-item">
          <button data-theme="os" onClick={changeTheme} className="theme-btn">
            <span className="material-symbols-outlined theme-icon">contrast</span>
            <span>OS</span>
          </button>
        </li>

        <li className="theme-item">
          <button data-theme="light" onClick={changeTheme} className="theme-btn">
            <span className="material-symbols-outlined theme-icon">light_mode</span>
            <span>Light</span>
          </button>
        </li>

        <li className="theme-item">
          <button data-theme="dark" onClick={changeTheme} className="theme-btn">
            <span className="material-symbols-outlined theme-icon">dark_mode</span>
            <span>Dark</span>
          </button>
        </li>
      </ul> }
    </div>
  );
};

export default ThemeSwitcher;