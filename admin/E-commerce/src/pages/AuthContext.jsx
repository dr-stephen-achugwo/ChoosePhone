import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token); // Decode the token
      if (decodedToken?.role === 'admin') {
        setUser(decodedToken); // Set user data
        setIsAuthenticated(true); // Mark as authenticated
        localStorage.setItem('user', JSON.stringify(decodedToken)); // Save user data in localStorage
        localStorage.setItem('token', token); // Save token in localStorage
      } else {
        alert('You do not have admin privileges');
        logout();
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Invalid token. Please log in again.');
      logout();
    }
  };
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Add this line
    console.log('User after logout:', user);
    navigate('/login'); 
  };

  // useEffect(() => {
  //   if (!user) {
  //     localStorage.removeItem('user');
  //   }
  // }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};