import type { MouseEvent } from 'react';

export type HeaderType = {
  showMenu: (e: MouseEvent) => void, 
  closeModal: () => void,
  visibleMenu: boolean
}

export type ThemeSwitcherType = {
  themeIcon: string,
  changeTheme: (e: MouseEvent) => void,
  visibleThemeMenu: boolean,
  handleMenus: (menu: string) => void
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
  link: string,
  imgPath: string,
  quantity: number
}