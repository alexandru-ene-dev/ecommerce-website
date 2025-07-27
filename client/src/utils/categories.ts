export type Category = { 
  title: string,
  subcategories: string[]
  src: string
  alt: string
};

export const categories: Category[] = [
  { 
    title: 'Laptops, Tablets & Phones',
    subcategories: ['Laptops & Accessories', 'Tablets & Accessories', 'Mobile Phones & Accessories'],
    src: 'laptops.jpeg',
    alt: 'Laptops, tablets and phones'
  },
  {
    title: 'Software',
    subcategories: ['Operating Systems', 'Desktop Applications', 'Antivirus Programs'],
    src: 'software.jpg',
    alt: 'Software'
  },
  {
    title: 'Gaming',
    subcategories: ['Gaming Consoles', 'Gaming Accessories', 'Video Games'],
    src: 'gaming.jpeg',
    alt: 'Gaming'
  },
  {
    title: 'Electronics',
    subcategories: ['Kitchen Appliances', 'Bathrooms Appliances', 'Air Conditioners & Heating', 'Everyday Use'],
    src: 'electronics.jpg',
    alt: 'Electronics'
  },
  {
    title: 'Fashion',
    subcategories: ['Clothes', 'Shoes', 'Accessories'],
    src: 'fashion.jpg',
    alt: 'Men fashion'
  },
  {
    title: 'Offers',
    subcategories: ['Hot This Week', '50% off', 'Giveaways'],
    src: 'offers.jpg',
    alt: 'Cheap offers'
  },
  {
    title: 'Newsletter',
    subcategories: ['Becoming a Web Developer Today', 'How React Changed the Web', 'Fullstack 2025 Roadmap'],
    src: 'newsletter.jpg',
    alt: 'Newsletter'
  }
];