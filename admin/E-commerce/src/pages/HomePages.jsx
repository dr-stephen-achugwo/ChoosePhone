import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import TotalRegisteredCard from "../component/RegisteredCard";
import TotalVisitorCard from "../component/totalVisitor";
import TotalVisitorChart from "../component/TotalChart";
import { useAuth } from "./AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function HomePages() {
  const [stats, setStats] = useState({ totalUsers: 0, totalVisitors: 0 });
  const { user } = useAuth();

  // Redirect non-admin users to the home or login page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />; // You can change this route based on where you want to redirect non-admin users
  }

  // Fetch total registered users
  useEffect(() => {
    fetch("http://localhost:4001/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((data) =>
        setStats((prev) => ({ ...prev, totalUsers: data.totalUsers }))
      )
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Fetch total visitors
  useEffect(() => {
    fetch("http://localhost:4001/api/visitor/total")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch visitor count");
        return res.json();
      })
      .then((data) =>
        setStats((prev) => ({ ...prev, totalVisitors: data.totalVisitors }))
      )
      .catch((err) => console.error("Error fetching visitor count:", err));
  }, []);

  const categories = [
    { name: "Mobiles", icon: "📱", path: "/PhonePages" },
    { name: "Laptops", icon: "💻", path: "/LaptopPages" },
    { name: "Tablets", icon: "📲", path: "/TabletPages" },
    { name: "Audio (Headphones, Earphones)", icon: "🎧", path: "/HeadphonePages" },
    { name: "Smartwatches & Fitness Bands", icon: "⌚", path: "/SmartwatchPages" },
    { name: "Televisions", icon: "📺", path: "/TelevisionPages" },
    { name: "Air Conditioners", icon: "❄️", path: "/AirconditionerPages" },
    { name: "Refrigerators", icon: "🧊", path: "/RefrigeratorPages" },
    { name: "Washing Machines", icon: "🧺", path: "/WashingmachinePages" },
    { name: "Cameras", icon: "📷", path: "/CameraPages" },
    { name: "Users", icon: "👤", path: "/BuilderPages" },
  ];

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {categories.map((category, index) => (
          <Link
            to={category.path}
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <span className="text-3xl mb-2">{category.icon}</span>
            <span className="text-sm font-medium text-gray-700 text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
      <hr className="my-6 border-gray-300" />
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalRegisteredCard totalUsers={stats.totalUsers} />
          <TotalVisitorCard totalVisitors={stats.totalVisitors} />
        </div>
        <div className="mt-6">
          <TotalVisitorChart />
        </div>
      </div>
      <Footer />
    </>
  );
}
