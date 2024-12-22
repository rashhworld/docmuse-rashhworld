import React from "react";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex w-full md:max-w-[70%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-blue-100 ml-3" : "bg-gray-100 mr-3"
          }`}
        >
          {isUser ? (
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          )}
        </div>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
