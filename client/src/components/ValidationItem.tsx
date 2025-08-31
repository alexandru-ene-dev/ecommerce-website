const ValidationItem = (props: { label: string, valid: boolean }) => (
  <li className={props.valid ? 'validation-item valid-item' : 'validation-item invalid-item'}>
    <span>{props.label}</span>
    <span 
      className={`material-symbols-outlined ${props.valid? "valid" : "invalid"}`}
    >
      {props.valid ? 'check' : 'close'}
    </span>
  </li>
);

export default ValidationItem;