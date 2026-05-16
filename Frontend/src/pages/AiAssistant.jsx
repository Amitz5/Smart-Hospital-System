import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AiAssistant() {
  const navigate = useNavigate();

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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">

        <div className="max-w-3xl mx-auto">

          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">

            <button
              onClick={() => navigate(-1)}
              className="bg-white shadow hover:shadow-md border px-4 py-2 rounded-xl transition font-medium"
            >
              ← Back
            </button>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full shadow-lg font-semibold">
              🤖 AI Assistant
            </div>

          </div>

          {/* MAIN CARD */}
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-gray-100 p-8">

            {/* HEADER */}
            <div className="text-center mb-8">

              <div className="text-6xl mb-4">
                🩺
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                AI Health Assistant
              </h1>

              <p className="text-gray-600 max-w-xl mx-auto">
                Describe your symptoms and receive basic health guidance instantly.
              </p>

            </div>

            {/* WARNING */}
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 text-sm">
              ⚠️ This AI provides only general health guidance and is not a replacement for professional medical consultation.
            </div>

            {/* TEXTAREA */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Symptoms
              </label>

              <textarea
                rows="6"
                placeholder="Example: I have fever, headache and body pain..."
                className="w-full border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={handleAsk}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-semibold text-lg shadow-lg hover:scale-[1.01] hover:shadow-xl transition-all disabled:opacity-70"
            >
              {loading ? "🤔 Thinking..." : "✨ Ask AI Assistant"}
            </button>

            {/* RESPONSE */}
            {reply && (
              <div className="mt-8">

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-6 shadow-sm">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl shadow-md">
                      🤖
                    </div>

                    <div>
                      <h2 className="font-bold text-lg text-gray-800">
                        AI Response
                      </h2>

                      <p className="text-sm text-gray-500">
                        Basic health guidance
                      </p>
                    </div>

                  </div>

                  <p className="text-gray-700 leading-7 whitespace-pre-line">
                    {reply}
                  </p>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}