export type New = {
  id: number,
  title: string,
  img: string,
  alt: string,
  oldPrice: number,
  price: number,
  sale: number
  link: string
}

export const whatsNew: New[] = [
  {
    id: 1,
    title: 'HP Victus 15 Gaming Laptop',
    img: 'laptop.jpg',
    alt: 'Front view of a laptop',
    oldPrice: 740,
    price: 600,
    sale: 20,
    link: 'products'
  },
  {
    id: 2,
    title: 'LG HD 720p Smart LED TV',
    img: 'tv.jpg',
    alt: 'Front view of a TV',
    oldPrice: 500,
    price: 350,
    sale: 30,
    link: 'string'
  },
  {
    id: 3,
    title: 'Samsung Galaxy S20 Cloud Navy',
    img: 'phone.jpg',
    alt: 'Full view of a phone',
    oldPrice: 600,
    price: 300,
    sale: 50,
    link: 'string'
  },
  {
    id: 4,
    title: 'ASUS 4K OLED Gaming Monitor',
    img: 'monitor.jpg',
    alt: 'Front view of gaming monitor',
    oldPrice: 1200,
    price: 900,
    sale: 25,
    link: 'string'
  },
  {
    id: 5,
    title: 'ECOVACS X9 PRO Robot Vacuum',
    img: 'vacuum.jpg',
    alt: 'A vacuum and mop robot',
    oldPrice: 1100,
    price: 935,
    sale: 15,
    link: 'string'
  },
  {
    id: 6,
    title: 'Microsoft Office Home & Business 2024',
    img: 'office.jpg',
    alt: 'Office Home and Business Background',
    oldPrice: 250,
    price: 225,
    sale: 10,
    link: 'string'
  }
];