import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:4001/AdminApi/register',
        { 
          email, 
          password, 
          role: 'admin',
          isTwoFactorEnabled: false 
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate('/login');
      } else {
        setError(response.data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Internal server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    textDecoration: 'none',
    color: isHovered ? '#007bff' : '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  return (
    <div className="register-container">
      <h2 className="register-title">User Registration</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="register-form">
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
            minLength="8"
            className="form-input"
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", marginTop: "20px" }}>
          <p style={{ margin: "0", fontSize: "16px", fontWeight: "bold" }}>
            Already a member?
          </p>
          <hr style={{ margin: "10px auto", width: "60%", border: "none", borderTop: "1px solid #ccc" }} />
          <Link
            to="/login"
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;