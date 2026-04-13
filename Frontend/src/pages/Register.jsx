import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOtp = async () => {
  try {
    await api.post("/auth/send-otp", { email: formData.email });
    toast.success("OTP sent to your email ✅");
    setStep(2);
  } catch (err) {
    toast.error("Failed to send OTP");
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/auth/verify-otp", {
      ...formData,
      otp,
    });

    toast.success("Registration successful ✅");
    navigate("/");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <Card className="w-[380px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">
          Create Account
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />

            <Button onClick={handleSendOtp} className="w-full">
              Send OTP
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <Input
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />

            <Input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />

            <Button className="w-full bg-green-600 hover:bg-green-700">
              Verify & Register
            </Button>
          </>
        )}

      </CardContent>
    </Card>
  </div>
);
}