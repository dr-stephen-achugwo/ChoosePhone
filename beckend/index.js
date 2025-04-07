// index.js
import dotenv from 'dotenv';
dotenv.config();  // Load environment variables at the top
import express from 'express';
import cors from 'cors';
import phoneRoute from './route/PhoneDisplay_route.js';
import tabletRoute from './route/TabletDisplay_route.js';
import laptopRoute from './route/LaptopDisplay_route.js';
import headphoneRoute from './route/HeadphoneDisplay_route.js';
import smartwatchRoute from './route/SmartwatchesDisplay_route.js';
import televisionRoute from './route/TelevisionDisplay_route.js';
import refrigeratorRoute from './route/RefrigeratorDisplay_route.js';
import washingmachineRoute from './route/WashingmachineDisplay_route.js';
import airconditionerRoute from './route/AirconditionerDisplay_route.js';
import cameraRoute from './route/CameraDisplay_route.js';
import connectToDatabase from './Database/db.js';
import userRoutes from "./route/User_Route.js";
import phoneRoutes from "./route/AddPhone_route.js";
import tabletRoutes from "./route/AddTablet_route.js";
import laptopRoutes from "./route/AddLaptop_route.js";
import smartwatchRoutes from "./route/AddSmartwatch_route.js";
import headphoneRoutes from "./route/AddHeadphone_route.js";
import televisionRoutes from "./route/AddTelevision_route.js";
import airconditionerRoutes from "./route/AddAirconditioner_route.js";
import washingmachineRoutes from "./route/AddWashingmachine_route.js";
import cameraRoutes from "./route/AddCamera_route.js";
import refrigeratorRoutes from "./route/AddRefrigerator_route.js";
import AdminUserRoutes from './route/AdminUser_route.js';
import statsRoutes from "./route/visitor_route.js";
import visitorRoutes from "./route/actualVisitor_route.js";
import ratingRoutes from './route/Rating_route.js';

const app = express();

// ✅ Properly configure CORS globally before routes
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173","http://192.168.31.223:3000"],  // ✅ Allow multiple frontend origins
  credentials: true,                // ✅ Allow cookies & auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Handle Preflight Requests Manually (Important!)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // Dynamically allow the requesting origin
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});

// Middleware
app.use(express.json());

// Set up PORT and MongoDB URI
const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDbURI;

// Connect to MongoDB
connectToDatabase(URI);

// ✅ Define all API routes
app.use('/phones', phoneRoute);
app.use('/tablets', tabletRoute);
app.use('/laptops', laptopRoute);
app.use('/headphones', headphoneRoute);
app.use('/smartwatches', smartwatchRoute);
app.use('/televisions', televisionRoute);
app.use('/refrigerators', refrigeratorRoute);
app.use('/washingmachines', washingmachineRoute);
app.use('/cameras', cameraRoute);
app.use('/airconditioners', airconditionerRoute);
app.use("/api/users", userRoutes);
app.use('/api', phoneRoutes);
app.use('/tabletapi', tabletRoutes);
app.use('/laptopapi', laptopRoutes);
app.use('/smartwatchapi', smartwatchRoutes);
app.use('/headphoneapi', headphoneRoutes);
app.use('/televisionapi', televisionRoutes);
app.use('/washingmachineapi', washingmachineRoutes);
app.use('/airconditionerapi', airconditionerRoutes);
app.use('/refrigeratorapi', refrigeratorRoutes);
app.use('/cameraapi', cameraRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/visitor", visitorRoutes);
app.use('/Ratingapi', ratingRoutes);

// ✅ Admin API Route (with proper CORS handling)
app.use('/AdminApi', AdminUserRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});