import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "patient") {
        window.location.href = "/patient";
      } else if (res.data.user.role === "doctor") {
        window.location.href = "/doctor";
      } else {
        window.location.href = "/admin";
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Card className="w-[380px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Login
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer"
          >
            Sign Up
          </span>
        </p>

      </CardContent>
    </Card>
  </div>
);
}
