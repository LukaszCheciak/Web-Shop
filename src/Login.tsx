import React, { useState } from 'react';
import axiosInstance from './axiosInstance.ts';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/accounts/jwt/create/', { username, password });
      sessionStorage.setItem('token', response.data.access);
      const userResponse = await axiosInstance.get('/accounts/users/me/');
      console.log(userResponse);
      sessionStorage.setItem('user', JSON.stringify(userResponse.data.username));
      navigate('/');
      location.reload();
    } catch {
      setError('An error occurred while trying to log in. Please try again.');
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
              <button className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button className="btn btn-secondary w-100" onClick={() => navigate("/register")}>Register</button>
              <button className="btn btn-secondary w-100" onClick={() => navigate("/")}>Back to Store</button>
              <button className="btn btn-secondary w-100" onClick={() => navigate("/cart")}>Go to Cart</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;