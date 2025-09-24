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
    max = 10,
  }: QuantitySelectorProps
) => {

  return (
    <div className="quantity-selector">
      <button
        aria-label="Reduce quantity by 1"
        className="cart-item-btn new-card-btn" 
        onClick={onDecrease} 
        disabled={quantity <= min}
      >
        -
      </button>

      <span aria-live="polite" className="quantity">{quantity}</span>

      <button
        aria-label="Increase quantity by 1" 
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
