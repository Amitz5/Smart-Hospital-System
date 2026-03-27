import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

 return (
  <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-md">
    <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
      <h1 className="font-bold text-lg tracking-wide">
        🏥 Smart Healthcare System
      </h1>

      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
      >
        Logout
      </button>
    </div>
  </div>
);
}