import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = [
  { username: "Lukasz", password: "Lukasz123" },
  { username: "Nauczyciel", password: "Nauczyciel123" },
  { username: "Wojciech", password: "Wojciech123" },
  { username: "Jarek", password: "Jarek123" },
  { username: "admin", password: "admin" },
];

interface LoginProps {
  setLoggedInUser: (username: string | null) => void;
  setCartItems: (items: CartItem[]) => void;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

const Login: React.FC<LoginProps> = ({ setLoggedInUser, setCartItems }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("loggedInUser", username);
      setLoggedInUser(username);
      const lastCart = localStorage.getItem("lastCart");
      if (lastCart) {
        setCartItems(JSON.parse(lastCart));
      }
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body d-flex flex-column align-items-center">
              <h1 className="text-center">Login</h1>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-danger text-center">{error}</p>}
              <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
              <button className="btn btn-secondary w-100 mb-3" onClick={() => navigate("/")}>Back to Store</button>
              <button className="btn btn-secondary w-100" onClick={() => navigate("/cart")}>Go to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;