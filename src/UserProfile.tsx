import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  username: string;
  savedCarts: CartItem[][];
  updateShippingInfo: (info: ShippingInfo) => void;
  shippingInfo: ShippingInfo;
  loadCart: (cart: CartItem[]) => void;
  orders: { [username: string]: any[] }; // Dodaj zamówienia do propsów
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  savedCarts,
  updateShippingInfo,
  shippingInfo,
  loadCart,
  orders,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const navigate = useNavigate();

  useEffect(() => {
    setAddress(shippingInfo.address);
    setCity(shippingInfo.city);
    setPostalCode(shippingInfo.postalCode);
  }, [shippingInfo]);

  const handleSave = () => {
    updateShippingInfo({ address, city, postalCode });
    setEditMode(false);
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {username}</p>
      <h2>Shipping Information</h2>
      {editMode ? (
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Postal Code"
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <p>Address: {address}</p>
          <p>City: {city}</p>
          <p>Postal Code: {postalCode}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
      <h2>Saved Carts</h2>
      {savedCarts.length === 0 ? (
        <p>No saved carts</p>
      ) : (
        savedCarts.map((cart, index) => (
          <div key={index}>
            <h3>Cart {index + 1}</h3>
            {cart.map((item) => (
              <div key={item.id}>
                <p>
                  {item.title} - Quantity: {item.quantity}
                </p>
              </div>
            ))}
            <button onClick={() => loadCart(cart)}>Load Cart</button>
          </div>
        ))
      )}
      <h2>Order History</h2>
      {orders[username] && orders[username].length > 0 ? (
        orders[username].map((order, index) => (
          <div key={index}>
            <h3>Order {index + 1}</h3>
            <p>Date: {new Date(order.date).toLocaleString()}</p>
            <p>Address: {order.shippingInfo.address}</p>
            <p>City: {order.shippingInfo.city}</p>
            <p>Postal Code: {order.shippingInfo.postalCode}</p>
            <h4>Items:</h4>
            {order.items.map((item: CartItem) => (
              <div key={item.id}>
                <p>
                  {item.title} - Quantity: {item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No orders yet</p>
      )}
      <button onClick={() => navigate("/")}>Back to Store</button>
    </div>
  );
};

export default UserProfile;
