import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from './AuthContext';

const TwoFactor = () => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <p>You do not have permission to access this page.</p>;
  }

  const setup2FA = async () => {
    try {
      const response = await axios.post('http://localhost:4001/AdminApi/setup-2fa', { email: user.email });
      setTwoFactorSecret(response.data.qrCode);
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while setting up 2FA.');
    }
  };

  useEffect(() => {
    setup2FA();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      const response = await axios.post('http://localhost:4001/AdminApi/verify-2fa', {
        email: user.email,
        token: code,
      });

      if (response.data.message === '2FA verification successful') {
        navigate('/');
      } else {
        alert('Invalid 2FA code. Please try again.');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'An error occurred while verifying 2FA.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Two-Factor Authentication</h2>
      <div className="mb-6">
        <p className="text-lg text-gray-600 mb-2">Scan the QR code below using your Google Authenticator app:</p>
        {twoFactorSecret ? (
          <QRCodeCanvas value={`otpauth://totp/YourAppName?secret=${twoFactorSecret}&issuer=YourAppName`} size={180} />
        ) : (
          <p className="text-gray-500 text-center">Generating QR Code...</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="2fa-code" className="block text-sm font-semibold text-gray-700 mb-2">
            Enter 2FA Code:
          </label>
          <input
            id="2fa-code"
            type="number"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            maxLength={6}
            className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small className="text-sm text-gray-500">
            Enter the 6-digit code from your authentication app.
          </small>
        </div>
        <button
          type="submit"
          disabled={isVerifying}
          className={`w-full p-4 text-white rounded-lg font-semibold transition-all duration-300 ${isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default TwoFactor;
