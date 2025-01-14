import React, { useState } from 'react';
import axios from './axiosInstance.ts';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    try {
      const response = await axios.post('/accounts/users/', { email: "test@example.com", username: username, password: password });
      console.log(response);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body d-flex flex-column align-items-center">
              <h1 className="text-center">Register</h1>
              <div className="mb-2 w-100">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-2 w-100">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-2 w-100">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button className="btn btn-secondary w-100" onClick={() => navigate("/login")}>Back to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;