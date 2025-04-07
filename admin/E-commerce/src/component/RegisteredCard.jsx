// TotalRegisteredCard.js
import React from "react";
import CountUp from "react-countup";

function TotalRegisteredCard({ totalUsers }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 w-64 text-center">
      <h3 className="text-gray-700 text-lg font-semibold">Total Registered Users</h3>
      <CountUp
        end={totalUsers}
        duration={2.5}
        separator=","
        className="text-3xl font-bold text-green-600 mt-2"
      />
      <p className="text-sm text-gray-500 mt-1">+10% from last month</p>
    </div>
  );
}

export default TotalRegisteredCard;
