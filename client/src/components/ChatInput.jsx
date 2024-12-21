import React from "react";

const ChatInput = ({
  question,
  setQuestion,
  handleSubmit,
  loading,
  selectedPdf,
}) => {
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={
            selectedPdf
              ? "Type your message..."
              : "Please select a PDF first..."
          }
          disabled={!selectedPdf || loading}
          className={`w-full p-4 pr-16 rounded-lg border ${
            !selectedPdf
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          } transition-all`}
        />
        <button
          type="submit"
          disabled={!selectedPdf || !question || loading}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${
            !selectedPdf || !question || loading
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-500 hover:bg-blue-50"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
