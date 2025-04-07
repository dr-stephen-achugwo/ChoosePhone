import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

function TotalVisitorChart() {
  const data = {
    week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [500, 700, 800, 650, 900, 1000, 1200],
    },
    month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [3000, 4500, 5000, 6000],
    },
    year: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [20000, 25000, 27000, 30000, 32000, 34000, 36000, 38000, 40000, 42000, 44000, 50000],
    },
  };

  const [view, setView] = useState("week");

  const chartData = {
    labels: data[view].labels,
    datasets: [
      {
        label: `Total Visitors (${view})`,
        data: data[view].values,
        borderColor: "blue",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 w-full">
      <h3 className="text-gray-700 text-lg font-semibold">Total Visitors</h3>
      <div className="flex justify-between items-center mt-4 mb-2">
        <select
          className="border border-gray-300 rounded px-3 py-1 text-gray-700"
          value={view}
          onChange={(e) => setView(e.target.value)}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default TotalVisitorChart;

