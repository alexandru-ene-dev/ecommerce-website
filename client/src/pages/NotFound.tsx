import { Link } from 'react-router-dom';
import notFoundPic from '../assets/images/404.png';


const NotFound = () => {
  return (
    <section className="not-found">
      <div className="not-found-flex">
        <div className="not-found-img-wrap">
          <img src={notFoundPic} alt="Page not found" />
        </div>

        <h1 className="section_title">Unfortunately, we couldn't find the page you were looking for...</h1>
      </div>

      <Link to="/" className="back-shopping-btn new-card-btn">Back to Main Page</Link>
    </section>
  );
}

export default NotFound;