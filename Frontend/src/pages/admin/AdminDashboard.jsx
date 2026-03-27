import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState("today");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  
  const handleCreateDoctor = async (e) => {
    e.preventDefault();
  
    try {
      await api.post("/auth/create-doctor", {
        name: doctorName,
        email: doctorEmail,
        password: doctorPassword,
      });
  
      toast.success("Doctor created successfully ✅");
  
      setDoctorName("");
      setDoctorEmail("");
      setDoctorPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

 const fetchStats = async (selectedRange = range) => {
  try {
    const res = await api.get(
      `/appointments/admin/stats?range=${selectedRange}`
    );
    setStats(res.data);
  } catch (err) {
    console.log(err);
  }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  if (!stats) return <p className="p-6">Loading...</p>;

  const pieData = [
    { name: "Booked", value: stats.booked },
    { name: "Completed", value: stats.completed },
    { name: "Cancelled", value: stats.cancelled },
  ];

  const barData = [
    { name: "Emergency", value: stats.emergency },
    { name: "Normal", value: stats.total - stats.emergency },
  ];

  const COLORS = ["#facc15", "#22c55e", "#ef4444"];

  return (
    <>
      <Navbar />
        <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Analytics</h1>
        <div className="flex gap-3 mb-6">
          {["today", "week", "month"].map((option) => (
            <button
              key={option}
              onClick={() => setRange(option)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                range === option
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {option.toUpperCase()}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-4">Create Doctor</h2>

        <form
          onSubmit={handleCreateDoctor}
          className="bg-white p-4 rounded shadow mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Doctor Name"
              className="border p-2 rounded"
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Doctor Email"
              className="border p-2 rounded"
              onChange={(e) => setDoctorEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              onChange={(e) => setDoctorPassword(e.target.value)}
              required
            />
          </div>

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
            Create Doctor
          </button>
        </form>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Appointment Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Emergency vs Normal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}
