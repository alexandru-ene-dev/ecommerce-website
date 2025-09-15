export type DealsType = {
  text: string,
  id: number,
  src: string,
  alt: string,
  url: string,
  sale?: number,
  subcategory?: string,
  subSubcategory?: string
};

const deals = [
  {
    id: 1,
    text: '50% off on matrix merchandise!',
    src: 'matrix.jpg',
    alt: 'matrix merchandise',
    active: true,
    url: '/categories/matrix',
    subSubcategory: 'matrix',
    sale: 50
  },

  {
    id: 2,
    text: 'From 20% off on latest video games!',
    src: 'games.jpg',
    alt: 'latest video games deal',
    active: false,
    url: '/categories/video-games',
    sale: 20
  },

  {
    id: 3,
    text: 'Buy 1, get 2! And many more on future tech!',
    src: 'future.jpg',
    alt: 'future technology deal',
    active: false,
    url: '/categories/buy-1-get-2',
  }
];

export default deals;