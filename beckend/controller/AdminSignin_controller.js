import AdminUser from '../model/AdminUser.js';
import bcrypt from 'bcryptjs';

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const verifiedEmail = "tomarpuneet79@gmail.com";

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (email === verifiedEmail && isPasswordValid) {
      return res.status(200).json({ message: "Verification successful", email: user.email });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({ error: "Internal server error. Please try again later." });
  }
};
