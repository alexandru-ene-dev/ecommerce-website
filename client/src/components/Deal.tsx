import { useTypewriter } from "../hooks/useTypewriter";

export type DealProps = {
  text: string
  src: string
  alt: string
  active: boolean
  id: number
};

const Deal = (props: DealProps) => {
  const typedText = useTypewriter(props.text, 50);

  return (
    <li data-active={props.active} className="deal-item">
      <p className="deal-text">{typedText}</p>
      <img
        className="deal-img"
        src={props.src} 
        alt={props.alt} 
      />
    </li>
  );
};

export default Deal;