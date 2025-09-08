type QuantitySelectorProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
};


const QuantitySelector = (
  {
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max,
  }: QuantitySelectorProps
) => {

  return (
    <div className="quantity-selector">
      <button 
        className="cart-item-btn new-card-btn" 
        onClick={onDecrease} 
        disabled={quantity <= min}
      >
        -
      </button>

      <span className="quantity">{quantity}</span>

      <button 
        className="cart-item-btn new-card-btn" 
        onClick={onIncrease} 
        disabled={max !== undefined && quantity >= max}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
