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
    <div>
      <h2>Login</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;