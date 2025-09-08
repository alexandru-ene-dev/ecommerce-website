import socialLinks from "../utils/socialLinks";


const SocialLinks = () => {
  const socialItems = socialLinks.map((item, index) => {
    return (
      <li key={index} className="social-item">
        <a className="social-link" href={item.url}>
          <img className="social-icon" src={item.img} alt={item.alt} />
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