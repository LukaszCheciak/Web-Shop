import React from "react";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  saveCart: () => void;
  loggedInUser: string | null;
  placeOrder: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  removeFromCart,
  decreaseQuantity,
  saveCart,
  loggedInUser,
  placeOrder,
}) => {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h1>Shopping Cart</h1>
      <Link to="/">
        <button>Back to Store</button>
      </Link>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id}>
              <h2>{item.title}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${item.price}</p>
              <button onClick={() => decreaseQuantity(item.id)}>
                Remove One
              </button>
              <button onClick={() => removeFromCart(item.id)}>
                Remove All
              </button>
            </div>
          ))}
          <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
          {loggedInUser ? (
            <button onClick={placeOrder}>Place Order</button>
          ) : (
            <p>You must be logged in to place an order</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
