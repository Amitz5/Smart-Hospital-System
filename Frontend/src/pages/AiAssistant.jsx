import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AiAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!message) return;

    try {
      setLoading(true);

      const res = await api.post("/ai/chat", {
        message,
      });

      setReply(res.data.reply);

    } catch (err) {
      console.log(err);
      setReply("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">

          <h1 className="text-3xl font-bold mb-2">
            AI Health Assistant
          </h1>

          <p className="text-sm text-red-500 mb-6">
            This AI provides basic health guidance only.
            Please consult a doctor for professional medical advice.
          </p>

          <textarea
            rows="5"
            placeholder="Describe your symptoms..."
            className="w-full border rounded-lg p-3 mb-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={handleAsk}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Thinking..." : "Ask AI"}
          </button>

          {reply && (
            <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              <h2 className="font-semibold mb-2">AI Response:</h2>
              <p>{reply}</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}