import { useTypewriter } from "../hooks/useTypewriter";
import { Link } from 'react-router-dom';
import { type DealsType } from "../utils/deals";


const Deal = (props: DealsType) => {
  const typedText = useTypewriter(props.text, 50);

  return (
    <li data-active={props.active} className="deal-item">
      <Link to={`${props.url}?sale=${props.sale}`}>
        <p className="deal-text">{typedText}</p>

        <img
          className="deal-img"
          src={props.src} 
          alt={props.alt} 
        />
      </Link>
    </li>
  );
};

export default Deal;