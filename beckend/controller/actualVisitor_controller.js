import Visitor from "../model/actualVisitor.js";

// Function to track a new visitor
export const trackVisitor = async (req, res) => {
  try {
    const visitorIP = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await Visitor.create({ ip: visitorIP });
    res.status(200).json({ message: "Visitor tracked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error tracking visitor", error: error.message });
  }
};

// Function to get total visitor count
export const getTotalVisitors = async (req, res) => {
  try {
    const totalVisitors = await Visitor.countDocuments();
    res.status(200).json({ totalVisitors });
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor count", error: error.message });
  }
};
