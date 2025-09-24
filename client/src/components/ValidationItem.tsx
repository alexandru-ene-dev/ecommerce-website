import CheckIcon from '../images/icons/check-icon.svg?component';
import CloseIcon from '../images/icons/close-icon.svg?component';


const ValidationItem = (props: { label: string, valid: boolean }) => (
  <li className={props.valid ? 'validation-item valid-item' : 'validation-item invalid-item'}>
    <span aria-hidden="true">{props.label}</span>

    <span 
      className="visually-hidden"
      role="status"
    >
      {props.valid ? `Met: ${props.label}` : `Not met: ${props.label}`}
    </span>

    {props.valid ? <CheckIcon className="valid"/> : <CloseIcon className="invalid"/>}
  </li>
);

export default ValidationItem;