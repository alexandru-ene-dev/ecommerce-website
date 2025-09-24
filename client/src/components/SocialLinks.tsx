import socialLinks from "../utils/socialLinks";
import LazyProductImage from "./LazyProductImage";


const SocialLinks = () => {
  const socialItems = socialLinks.map((item, index) => {
    return (
      <li key={index} className="social-item">
        <a 
          rel="noopener noreferrer" 
          aria-label={item.aria} 
          className="social-link" 
          href={item.url}
        >
          <LazyProductImage 
            name={item.name} 
            className="social-icon" 
            imageName={item.img} 
            alt="" 
          />
        </a>
      </li>
    );
  });


  return (
    <section className="social-wrapper">
      <h2 className="social-par">Our Social Network</h2>
      
      <ul className="social-list">
        {socialItems}
      </ul>

    </section>
  );
};

export default SocialLinks;