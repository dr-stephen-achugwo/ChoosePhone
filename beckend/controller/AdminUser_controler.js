import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminUser from '../model/AdminUser.js';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Register a new admin user
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user with default role "admin" or provided role
    const newUser = new AdminUser({
      email,
      password: hashedPassword,
      role: role || "admin",
      isTwoFactorEnabled: false,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ success: false, error: "Internal server error. Please try again later." });
  }
};

// Login an admin user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials - Email not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid credentials - Incorrect password' });
    }

    // Ensure the user has the "admin" role
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'You do not have admin privileges' });
    }

    // JWT Token creation
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token and 2FA requirement if enabled
    res.json({ success: true, token, twoFactorRequired: user.isTwoFactorEnabled });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, error: 'Internal server error. Please try again later.' });
  }
};
// Setup 2FA for an admin user
export const setup2FA = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'User not found' });

    const secret = speakeasy.generateSecret();
    user.twoFactorSecret = secret.base32;
    user.isTwoFactorEnabled = true;
    await user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to generate QR code' });
      }
      res.json({ success: true, secret: secret.base32, qrCode: data_url });
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Verify the 2FA code for an admin user
export const verify2FA = async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(400).json({ success: false, error: 'User not found' });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (verified) {
      res.json({ success: true, message: '2FA verification successful' });
    } else {
      res.status(400).json({ success: false, error: 'Invalid 2FA token' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};