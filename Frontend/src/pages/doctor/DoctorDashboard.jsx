import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  {queue.length === 0 && (
  <p className="text-center text-gray-500">No patients in queue</p>
  )}
    {queue.map((appt, index) => (
      <Card
  key={appt.appointmentId}
  className={`mb-4 shadow-sm hover:shadow-md transition ${
    appt.isEmergency ? "border-2 border-red-400" : ""
  }`}
>
  <CardContent className="p-5">

    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-lg">
        #{index + 1} {appt.patientName}
      </h3>

      {appt.isEmergency && (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
          🚨 Emergency
        </span>
      )}
    </div>

    <p className="text-gray-600 mt-2">
      ⏰ {appt.timeSlot}
    </p>

    <p className="text-sm text-gray-500 mt-1">
      ⏳ Est. Wait: {appt.estimatedWaitTime} mins
    </p>

    <Button
      onClick={() => completeAppointment(appt.appointmentId)}
      className="mt-3 bg-green-600 hover:bg-green-700"
    >
      Complete
    </Button>

  </CardContent>
</Card>
    ))}
  </div>
  </div>
  </>
);
}