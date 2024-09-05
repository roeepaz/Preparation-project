import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Hardcoded credentials
    const adminArr = ['admin123', 'admin123'];
    const users = ['user1', 'user1'];

    if (username === adminArr[0] && password === adminArr[1]) {
      sessionStorage.setItem('role', 'admin');
      alert('Welcome, Admin!');
      navigate('/App');
    } else if (username === users[0] && password === users[1]) {
      sessionStorage.setItem('role', 'user');
      alert('Welcome, User!');
      navigate('/App');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
