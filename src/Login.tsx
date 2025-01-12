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
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => navigate("/")}>Back to Store</button>
      <button onClick={() => navigate("/cart")}>Go to Cart</button>
    </div>
  );
};

export default Login;
