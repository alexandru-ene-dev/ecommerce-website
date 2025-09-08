import type { NewProductType } from "./types";


const OrderSummary = ({ cart }: { cart: NewProductType[] }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 100 ? 0 : 10; // free shipping over $100
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;


  return (
    <div className="order-summary">
      <h2>Order Summary</h2>

      <div className="order-prices">
        <p>
          <span>Subtotal:</span> 
          <span>${subtotal.toFixed(2)}</span>
        </p>

        <p>
          <span>Shipping:</span> 
          <span>${shipping.toFixed(2)}</span>
        </p>

        <p>
          <span>Tax (10%):</span> 
          <span>${tax.toFixed(2)}</span>
        </p>

        <hr />

        <p>
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </p>
      </div>

      <button className="new-card-btn">Proceed to Checkout</button>
    </div>
  );
};

export default OrderSummary;