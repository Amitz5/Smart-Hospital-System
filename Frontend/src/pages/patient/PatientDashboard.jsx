import Navbar from "../../components/Navbar";
import { useState,useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  const [doctorId, setDoctorId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [queuePositions, setQueuePositions] = useState({});


  useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await api.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchDoctors();

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/patient");
      setAppointments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchAppointments();
}, []);

useEffect(() => {
  const fetchQueue = async () => {
    const positions = {};

    for (let appt of appointments) {
      if (appt.status === "booked") {
        const res = await api.get(`/appointments/queue/${appt._id}`);
        positions[appt._id] = res.data.position;
      }
    }

    setQueuePositions(positions);
  };

  if (appointments.length) fetchQueue();
}, [appointments]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/appointments", {
        doctor: doctorId,
        appointmentDate: new Date(date).toISOString(),
        timeSlot: timeslot,
        isEmergency: isEmergency,
      });

      toast.success("Appointment Booked Successfully ✅");
    } catch (err) {
      // console.log(err);
      console.log(err.response?.data);
      // alert("Error booking appointment");
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  const cancelAppointment = async (id) => {
  try {
    await api.put(`/appointments/cancel/${id}`);

    // refresh appointments list
    const res = await api.get("/appointments/patient");
    setAppointments(res.data);
    toast.success("Appointment Cancelled")
  } catch (err) {
    console.log(err);
  }
};

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100">
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient Dashboard</h1>

     <Card className="mb-8 shadow-md">
  <CardHeader>
    <CardTitle>Book Appointment</CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    <form onSubmit={handleSubmit} className="space-y-4">

      <select
        className="border p-2 w-full rounded-md"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
      >
        <option value="">Select Doctor</option>
        {doctors.map((doc) => (
          <option key={doc._id} value={doc._id}>
            {doc.name}
          </option>
        ))}
      </select>

      <Input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <Input
        type="text"
        placeholder="Timeslot (10:00 - 11:00)"
        onChange={(e) => setTimeslot(e.target.value)}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          onChange={(e) => setIsEmergency(e.target.checked)}
        />
        Emergency Case
      </label>

      <Button className="w-full">
        Book Appointment
      </Button>

    </form>
  </CardContent>
</Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">My Appointments</h2>

        {appointments.map((appt) => (
          <Card key={appt._id} className="mb-4 shadow-sm hover:shadow-md transition">
  <CardContent className="p-5">

    <div className="flex justify-between items-center">
      <h3 className="font-semibold text-lg">
        Dr. {appt.doctor?.name}
      </h3>

      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          appt.status === "booked"
            ? "bg-yellow-100 text-yellow-700"
            : appt.status === "completed"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {appt.status}
      </span>
    </div>

    <p className="text-gray-600 mt-2">
      📅 {new Date(appt.appointmentDate).toDateString()}
    </p>

    <p className="text-gray-600">
      ⏰ {appt.timeSlot}
    </p>

    {queuePositions[appt._id] && (
      <p className="text-green-600 font-medium mt-2">
        🟢 Queue Position: #{queuePositions[appt._id]}
      </p>
    )}

    {appt.status === "booked" && (
      <Button
        onClick={() => cancelAppointment(appt._id)}
        className="mt-3 bg-red-500 hover:bg-red-600"
      >
        Cancel
      </Button>
    )}

  </CardContent>
</Card>))}
      </div>
    </div>
    </div>
  </>
  );
}

