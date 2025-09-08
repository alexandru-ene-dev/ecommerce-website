export type Category = { 
  title: string,
  subcategories: Subcategory[]
  src: string
  alt: string
};

export type Subcategory = {
  name: string,
  slug: string,
  content?: string[]
}

export const categories: Category[] = [
  { 
    title: 'Laptops, Tablets & Phones',
    subcategories: [
      { 
        name: 'Laptops & Accessories', 
        slug: 'laptops-and-accessories', 
        content: ['Laptops', 'Accessories']
      },
      { 
        name: 'Tablets & Accessories', 
        slug: 'tablets-and-accessories',
        content: ['Tablets', 'Accessories'] 
      },
      { 
        name: 'Mobile Phones & Accessories', 
        slug: 'mobile-phones-and-accessories',
        content: ['Phones', 'Accessories']
      }
    ],
    src: 'laptops.jpeg',
    alt: 'Laptops, tablets and phones'
  },

  {
    title: 'Software',
    subcategories: [
      { name: 'Operating Systems', slug: 'operating-systems' },
      { name: 'Desktop Applications', slug: 'desktop-applications' },
      { name: 'Antivirus Programs', slug: 'antivirus-programs' }
    ],
    src: 'software.jpg',
    alt: 'Software'
  },

  {
    title: 'Gaming',
    subcategories: [
      { name: 'Gaming Consoles', slug: 'gaming-consoles' },
      { name: 'Gaming Accessories', slug: 'gaming-accessories' },
      { name: 'Video Games', slug: 'video-games' }
    ],
    src: 'gaming.jpeg',
    alt: 'Gaming'
  },

  {
    title: 'Electronics',
    subcategories: [
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
      { name: 'Bathroom Appliances', slug: 'bathroom-appliances' },
      { name: 'Air Conditioners & Heating', slug: 'air-conditioners-and-heating' },
      { name: 'Everyday Use', slug: 'everyday-use' }
    ], 
    src: 'electronics.jpg',
    alt: 'Electronics'
  },

  {
    title: 'Fashion',
    subcategories: [
      { 
        name: 'Clothes', 
        slug: 'clothes',
        content: ['Men', 'Women'] 
      },
      { name: 'Shoes', slug: 'shoes' },
      { name: 'Accessories', slug: 'accessories' }
    ],
    src: 'fashion.jpg',
    alt: 'Men fashion'
  },

  {
    title: 'Collections',
    subcategories: [
      { name: 'The Matrix', slug: 'matrix' },
      { name: 'Star Wars', slug: 'star-wars' },
      { name: 'Cyberpunk 2077', slug: 'cyberpunk-2077' }
    ],
    src: 'collections.jpg',
    alt: 'Movie and game-themed merchandise'
  },

  {
    title: 'Offers',
    subcategories: [
      { name: 'Hot This Week', slug: 'hot-this-week' },
      { name: '50% off', slug: '50-off' },
      { name: 'Giveaways', slug: 'giveaways' }
    ],
    src: 'offers.jpg',
    alt: 'Cheap offers'
  },

  {
    title: 'Newsletter',
    subcategories: [
      { name: 'Becoming a Web Developer Today', slug: 'becoming-a-web-developer-today' },
      { name: 'How React Changed the Web', slug: 'how-react-changed-the-web' },
      { name: '2025 Fullstack Roadmap', slug: '2025-fullstack-roadmap' } 
    ],
    src: 'newsletter.jpg',
    alt: 'Newsletter'
  }
];