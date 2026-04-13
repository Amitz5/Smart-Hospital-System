import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Analytics
        </h1>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-6">
          {["today", "week", "month"].map((option) => (
            <Button
              key={option}
              onClick={() => setRange(option)}
              variant={range === option ? "default" : "outline"}
              className="capitalize"
            >
              {option}
            </Button>
          ))}
        </div>

        {/* STATS CARDS */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total</p>
              <h2 className="text-2xl font-bold">{stats.total}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Booked</p>
              <h2 className="text-2xl font-bold text-yellow-600">
                {stats.booked}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Completed</p>
              <h2 className="text-2xl font-bold text-green-600">
                {stats.completed}
              </h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Cancelled</p>
              <h2 className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </h2>
            </CardContent>
          </Card>
        </div>

        {/* CREATE DOCTOR */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Doctor</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateDoctor} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Input
                  placeholder="Doctor Name"
                  onChange={(e) => setDoctorName(e.target.value)}
                />

                <Input
                  type="email"
                  placeholder="Doctor Email"
                  onChange={(e) => setDoctorEmail(e.target.value)}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setDoctorPassword(e.target.value)}
                />
              </div>

              <Button>Create Doctor</Button>
            </form>
          </CardContent>
        </Card>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={100} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency vs Normal</CardTitle>
            </CardHeader>

            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  </>
);
}
