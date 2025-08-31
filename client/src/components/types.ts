import type { Dispatch, SetStateAction, MouseEvent } from 'react';

export type HeaderType = {
  showMenu: (e: MouseEvent) => void, 
  closeModal: () => void,
  visibleMenu: boolean,
  toggleLoginMenu: () => void,
}

export type MobileHeaderType = {
  visibleMenu: boolean,
  showMenu: (e: MouseEvent) => void, 
  visibleHeader: boolean,
  submitSearch: (e: MouseEvent<HTMLFormElement>) => void,
  toggleLoginMenu: () => void,
  toggleThemeMenu: (e: MouseEvent) => void,
  visibleThemeMenu: boolean,
  changeTheme: (e: MouseEvent) => void,
  searchInput: string,
  setSearchInput: Dispatch<SetStateAction<string>>,
  closeModal: () => void,
};

export type DesktopHeaderType = {
  visibleHeader: boolean,
  submitSearch: (e: MouseEvent<HTMLFormElement>) => void,
  toggleLoginMenu: () => void,
  toggleThemeMenu: (e: MouseEvent) => void,
  visibleThemeMenu: boolean,
  changeTheme: (e: MouseEvent) => void,
  searchInput: string,
  setSearchInput: Dispatch<SetStateAction<string>>
};

export type ThemeSwitcherType = {
  themeIcon: string,
  changeTheme: (e: MouseEvent) => void,
  toggleThemeMenu: (e: MouseEvent) => void,
  visibleThemeMenu: boolean
}

export type NewProductType = {
  _id: string,
  id: number,
  title: string,
  img: string,
  alt: string,
  oldPrice: number,
  price: number,
  sale: number,
  category: string,
  subcategory: string,
  content?: string[],
  link: string
}