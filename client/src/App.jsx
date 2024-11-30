import React, { useState, useEffect, useRef } from "react";
const baseURL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question) return;

    setConversation([...conversation, { text: question, sender: "user" }]);
    setQuestion("");

    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/ask-question`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (data.answer) {
        setConversation((prev) => [
          ...prev,
          { text: data.answer, sender: "bot" },
        ]);
      }
    } catch (err) {
      console.error("Error occurred while processing the request.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className="app-container flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div
        ref={chatContainerRef}
        className="flex-grow space-y-4 mb-4 overflow-y-auto border border-gray-300 rounded-lg p-4"
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 max-w-md rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 max-w-md rounded-lg bg-gray-200 text-gray-800">
              Almost there! Gathering the info for you...
            </div>
          </div>
        )}
      </div>

      <form
        className="input-container flex items-center"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Type your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="outline-none px-4 py-3 rounded-l-lg border border-gray-300 w-full"
        />
        <button
          type="submit"
          className="submit-btn px-6 py-3 bg-blue-500 border border-blue-500 text-white rounded-r-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;
