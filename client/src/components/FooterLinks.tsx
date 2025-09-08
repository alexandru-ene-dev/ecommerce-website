import footerLinksList from "../utils/footerLinksList";
import { Link } from 'react-router-dom';
import useIsMobile from "../hooks/useIsMobile";


const FooterLinks = () => {
  const isMobile = useIsMobile();


  const footerMenuElements = footerLinksList.map((obj, index) => {
    const linkItemElements = obj.links.map((link, i) => {
      return (
        <li key={i}>
          <Link to={link.url}>{link.name}</Link>
        </li>
      );
    });
    
    return (
      <details open={!isMobile} key={index} className="footer-links_card">
        <summary 
          className="footer-links_btn"
          onClick={!isMobile? (e) => e.preventDefault() : undefined}
        >
          {obj.title}
        </summary>

        <nav className="footer-menu">
          <ul className="footer-links_list">
            {linkItemElements}
          </ul>
        </nav>
      </details>
    ); 
  });
  

  return (
    <div className="footer-links">
      {footerMenuElements}
    </div>
  );
};

export default FooterLinks;