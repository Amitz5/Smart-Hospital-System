import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [prescription, setPrescription] = useState({
    medicines: "",
    diagnosis: "",
    advice: "",
  });

  const fetchQueue = async () => {
    try {
      const res = await api.get("/appointments/doctor/queue");
      setQueue(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQueue();

    const interval = setInterval(() => {
      fetchQueue();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const savePrescription = async () => {
    try {
      await api.put(
        `/appointments/${selectedAppointment}/complete`,
        prescription
      );

      setSelectedAppointment(null);

      setPrescription({
        medicines: "",
        diagnosis: "",
        advice: "",
      });

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

          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Doctor Queue
          </h1>

          {queue.length === 0 && (
            <p className="text-center text-gray-500">
              No patients in queue
            </p>
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
                  onClick={() =>
                    setSelectedAppointment(appt.appointmentId)
                  }
                  className="mt-3 bg-green-600 hover:bg-green-700"
                >
                  Complete & Add Prescription
                </Button>

              </CardContent>
            </Card>
          ))}

          {/* PRESCRIPTION MODAL */}
          {selectedAppointment && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

              <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

                <h2 className="text-2xl font-bold mb-5">
                  Add Prescription
                </h2>

                <textarea
                  placeholder="Diagnosis"
                  className="w-full border rounded-lg p-3 mb-4"
                  rows="2"
                  value={prescription.diagnosis}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      diagnosis: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Medicines"
                  className="w-full border rounded-lg p-3 mb-4"
                  rows="3"
                  value={prescription.medicines}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      medicines: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Advice"
                  className="w-full border rounded-lg p-3 mb-4"
                  rows="3"
                  value={prescription.advice}
                  onChange={(e) =>
                    setPrescription({
                      ...prescription,
                      advice: e.target.value,
                    })
                  }
                />

                <div className="flex gap-3">

                  <Button
                    onClick={savePrescription}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save Prescription
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Cancel
                  </Button>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}