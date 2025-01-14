import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "./axiosInstance.ts";

interface UserProfileProps {
  username: string;
  savedCarts: CartItem[][];
  updateShippingInfo: (info: ShippingInfo) => void;
  shippingInfo: ShippingInfo;
  loadCart: (cart: CartItem[]) => void;
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

interface Order {
  items: CartItem[];
  total: number;
  date: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  savedCarts,
  updateShippingInfo,
  shippingInfo,
  loadCart,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
  const [errors, setErrors] = useState<{ address?: string; city?: string; postalCode?: string }>({});
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  if (!username) {
    navigate("/login");
  }

  useEffect(() => {
    axios.get(`/profile/orders`).then((response) => {
      console.log(response);
      setOrders(response.data);
    });
  }, [username]);

  useEffect(() => {
    axios.get(`/profile/shipping_info`).then((response) => {
      console.log(response);
      updateShippingInfo(response.data);
    });
  }, [address, city, postalCode]);

  useEffect(() => {
    setAddress(shippingInfo.address);
    setCity(shippingInfo.city);
    setPostalCode(shippingInfo.postalCode);
  }, [shippingInfo]);

  const validateAddress = (address: string) => {
    if (!address) return "Address is required.";
    return "";
  };

  const validateCity = (city: string) => {
    if (!city) return "City is required.";
    return "";
  };

  const validatePostalCode = (postalCode: string) => {
    if (!postalCode) return "Postal code is required.";
    if (!/^\d{5}$/.test(postalCode)) return "Postal code must be 5 digits.";
    return "";
  };

  const handleSave = () => {
    const addressError = validateAddress(address);
    const cityError = validateCity(city);
    const postalCodeError = validatePostalCode(postalCode);

    if (addressError || cityError || postalCodeError) {
      setErrors({ address: addressError, city: cityError, postalCode: postalCodeError });
      return;
    }

    axios.post(`/profile/update_shipping_info/`, { address, city, postal_code: postalCode })
      .then((response) => {
        console.log(response);
      });
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
          {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
          {errors.city && <p style={{ color: "red" }}>{errors.city}</p>}
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Postal Code"
          />
          {errors.postalCode && <p style={{ color: "red" }}>{errors.postalCode}</p>}
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
      {orders && orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index}>
            <h3>Order {index + 1}</h3>
            <p>Date: {order.date}</p>
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