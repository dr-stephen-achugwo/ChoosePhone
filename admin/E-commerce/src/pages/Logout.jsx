import React from 'react';
import { useAuth } from './AuthContext'; // Adjust the import path

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
};

export default LogoutButton;