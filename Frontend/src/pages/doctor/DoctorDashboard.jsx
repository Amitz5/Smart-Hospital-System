import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);

  const fetchQueue = async () => {
    try {
      const res = await api.get("/appointments/doctor/queue");
      setQueue(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQueue(); // first load

    const interval = setInterval(() => {
      fetchQueue();
    }, 5000); // refresh every 5 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  const completeAppointment = async (id) => {
    try {
      await api.put(`/appointments/${id}/complete`);
      fetchQueue();
    } catch (err) {
      console.log(err);
    }
  };

 return (
  <>
  <Navbar />
  <div className="min-h-screen bg-gray-100">
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctor Queue</h1>

    {queue.map((appt, index) => (
      <div
        key={appt.appointmentId}
        className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition mb-4 border border-gray-100"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            #{index + 1} {appt.patientName}
          </h3>

          {appt.isEmergency && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
              Emergency
            </span>
          )}
        </div>

        <p className="text-gray-600 mt-2">
          ⏰ {appt.timeSlot}
        </p>

        <button
          onClick={() => completeAppointment(appt.appointmentId)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
        >
          Complete
        </button>
      </div>
    ))}
  </div>
  </div>
  </>
);
}