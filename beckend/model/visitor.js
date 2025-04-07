import User from "./User_model.js";

export const getStats = async () => {
  const totalUsers = await User.countDocuments();
  return { totalUsers };
};