// TotalVisitorCard.js
import React from "react";
import CountUp from "react-countup";

function TotalVisitorCard({ totalVisitors }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 w-64 text-center">
      <h3 className="text-gray-700 text-lg font-semibold">Total Visitors</h3>
      <CountUp
        end={totalVisitors}
        duration={2.5}
        separator=","
        className="text-3xl font-bold text-blue-600 mt-2"
      />
      <p className="text-sm text-gray-500 mt-1">+5% from last week</p>
    </div>
  );
}

export default TotalVisitorCard;
