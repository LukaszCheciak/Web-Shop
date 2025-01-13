import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './UserProfile.css';

interface UserProfileProps {
  username: string;
  savedCarts: CartItem[][];
  updateShippingInfo: (info: ShippingInfo) => void;
  shippingInfo: ShippingInfo;
  loadCart: (cart: CartItem[]) => void;
  orders: { [username: string]: any[] };
  handleLogout: () => void;
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
  handleLogout,
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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-center">User Profile</h1>
      </div>
      <div className="card mb-5">
        <div className="card-body px-5 d-flex flex-column align-items-start">
          <h3>Welcome, <b>{username} </b> </h3>
          <h3><b>Shipping information:</b></h3>
          <table className="table">
            <thead>
              <tr>
                <th>Address</th>
                <th>City</th>
                <th>Postal Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {editMode ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal Code"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{address}</td>
                    <td>{city}</td>
                    <td>{postalCode}</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
          {editMode ? (
            <button className="btn btn-primary w-100 ms-0" onClick={handleSave}>Save shipping info</button>
          ) : (
            <button className="btn btn-secondary w-100 ms-0" onClick={() => setEditMode(true)}>Edit shipping info</button>
          )}
          <button className="btn btn-danger w-100 ms-0" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <h2>Saved Carts</h2>
      {savedCarts.length === 0 ? (
        <p className="mb-5">No saved carts</p>
      ) : (
        savedCarts.map((cart, index) => (
          <div key={index} className="card mb-5">
            <div className="card-body">
              <h3>Cart {index + 1}</h3>
              {cart.map((item) => (
                <div key={item.id}>
                  <p>{item.title} - Quantity: {item.quantity}</p>
                </div>
              ))}
              <button className="btn btn-primary" onClick={() => loadCart(cart)}>Load Cart</button>
            </div>
          </div>
        ))
      )}
      <h2>Order History</h2>
      {orders[username] && orders[username].length > 0 ? (
        orders[username].map((order, index) => (
          <div key={index} className="card mb-5">
            <div className="card-body px-5 d-flex flex-column align-items-start">
              <h3><b>Order #{index + 1}</b></h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Postal Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>{order.shippingInfo.address}</td>
                    <td>{order.shippingInfo.city}</td>
                    <td>{order.shippingInfo.postalCode}</td>
                  </tr>
                </tbody>
              </table>
              <h4><b>Items:</b></h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: CartItem) => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p>No orders yet</p>
      )}
      <button className="btn btn-secondary mt-4" onClick={() => navigate("/")}>Back to Store</button>
    </div>
  );
};

export default UserProfile;