import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-96"
      >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Account
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 w-full mb-4 rounded"
            onChange={handleChange}
            required
          />

          <button
            type="button"
            onClick={handleSendOtp}
            className="bg-blue-600 text-white w-full py-2 rounded-lg"
          >
            Send OTP
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            className="border p-2 w-full mb-4 rounded"
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="border p-2 w-full mb-4 rounded"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
            onChange={handleChange}
            required
          />

          <button className="bg-green-600 text-white w-full py-2 rounded-lg">
            Verify & Register
          </button>
        </>
      )}
      </form>
    </div>
  );
}