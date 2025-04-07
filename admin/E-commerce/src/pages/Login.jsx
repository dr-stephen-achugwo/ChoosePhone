import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:4001/AdminApi/login', { email, password });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save token in localStorage
        login(response.data.token); // Pass the token to the login function
  
        if (response.data.twoFactorRequired) {
          navigate('/2fa');
        } else {
          navigate('/');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'An error occurred. Please try again.';
      setError(errorMessage);
    }
  };

  const registerButtonStyle = {
    textDecoration: 'none',
    color: isHovered ? '#007bff' : '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
        <hr style={{ marginBottom: '20px', border: 'none', borderTop: '1px solid #ccc' }} />
        
        <p style={{ textAlign: 'center', margin: '10px 0', fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
          Not an admin?
        </p>
        <div style={{ textAlign: 'center' }}>
          <Link 
            to='/registration' 
            style={registerButtonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;