import React from "react";
import {Link, useNavigate} from "react-router-dom";
import './Cart.css';

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
  const navigate = useNavigate();

  if (!sessionStorage.getItem("user")) {
    navigate("/login");
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Shopping Cart</h1>
      <Link to="/">
        <button className="btn btn-secondary mb-4">Back to Store</button>
      </Link>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      Remove One
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-end">Total Price: ${totalPrice.toFixed(2)}</h2>
          {loggedInUser ? (
            <button className="btn btn-primary w-100 mt-3" onClick={placeOrder}>Place Order</button>
          ) : (
            <p className="text-danger">You must be logged in to place an order</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;