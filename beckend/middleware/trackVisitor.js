import Visitor from "../model/visitor.js";

export const trackVisitor = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await Visitor.create({ ip });
  } catch (error) {
    console.error("Error tracking visitor:", error);
  }
  next();
};
