import { categories } from "../utils/categories";

const DesktopMenu = () => {
  const categoryElements = categories.map((cat, i) => {
    const imgSrc = new URL(`../assets/images/${cat.src}`, import.meta.url).href;

    return (
      <li key={i} className="desktop-nav_item">
        <a className="desktop-nav_link" href="#">{cat.title}</a>
        <div className="desktop-nav_link-card">
          <div className="link-card-wrapper">
            <ul className="desktop-nav_sub-list">
              {cat.subcategories.map((sub, index) => (
                <li key={index} className="subcategory-item">
                  <a className="sublink" href="#">{sub}</a>
                </li>
              ))}
            </ul>
          <img src={imgSrc} alt={cat.alt} />
          </div>
        </div>
      </li>
    );
  });

  return (
    <div className="desktop-nav">
      <ul className="desktop-nav_list">{categoryElements}</ul>
    </div>
  );
};

export default DesktopMenu;