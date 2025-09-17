type Link = {
  name: string,
  url: string
};

type footerLinksListType = {
  title: string,
  links: Link[]
};

const footerLinksList: footerLinksListType[] = [
  {
    title: 'Customer Service',
    links: [ 
      { name: 'Request a Return', url: '/request-return' }, 
      { name: 'Return Information', url: '/return-info' }, 
      { name: 'Delivery Information', url: '/delivery-info' }, 
      { name: 'FAQ', url: '/faq' }, 
      { name: 'Contact Us', url: '/contact' }
    ]
  },

  {
    title: 'Privacy & Legal',
    links: [
      { name: 'Terms & Conditions', url: '/terms-and-conditions' },
      { name: 'Privacy Policy', url: '/privacy-policy' },
      { name: 'Cookies', url: '/cookies' },
      { name: 'Terms of Use', url: '/terms-of-use' }
    ]
  },

  {
    title: 'Company',
    links: [
      { name: 'Careers', url: '/careers' },
      { name: 'About Us', url: '/about' }
    ]
  }
];

export default footerLinksList;