import { useNavigate,useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600";

  return (
    <div className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">

      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1
          // onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-600 cursor-pointer"
        >
          🏥 Smart Healthcare
        </h1>

        {/* NAV LINKS */}
        <div className="flex items-center gap-6">

          {user?.role === "patient" && (
            <span
              onClick={() => navigate("/patient")}
              className={`cursor-pointer ${isActive("/patient")}`}
            >
              Dashboard
            </span>
          )}

          {user?.role === "doctor" && (
            <span
              onClick={() => navigate("/doctor")}
              className={`cursor-pointer ${isActive("/doctor")}`}
            >
              Queue
            </span>
          )}

          {user?.role === "admin" && (
            <span
              onClick={() => navigate("/admin")}
              className={`cursor-pointer ${isActive("/admin")}`}
            >
              Analytics
            </span>
          )}

          {/* ROLE BADGE */}
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
            {user?.role}
          </span>

          {/* LOGOUT */}
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="rounded-full px-4"
          >
            Logout
          </Button>

        </div>
      </div>
    </div>
  );
}