import React, { useState } from "react";
import { toast } from "react-hot-toast";
const pdfUploadApi = "https://superadmin.testfree.in/misc/upload/media?user=docmuse";

const Sidebar = ({
  pdfLink,
  setPdfLink,
  handlePdfSubmit,
  pdfLinks,
  selectedPdf,
  selectPdf,
  isProcessing,
  setIsProcessing,
  deletePdf,
  isSidebarOpen,
  setIsSidebarOpen,
  apiKey,
  setApiKey,
}) => {
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(pdfUploadApi, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "success") {
        setPdfLink(data.url);
        await handlePdfSubmit(e, data.url);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApiKeyChange = (e) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
  };

  const handleSaveKey = () => {
    localStorage.setItem("docmuseAPI", apiKey);
    setIsEditingKey(false);
    toast.success("API key saved successfully");
  };

  return (
    <div
      className={`fixed top-0 left-0 z-10 w-full sm:w-96 bg-white border-r border-gray-200 h-[100dvh] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-2 mb-4">
            <h2 className="text-xl font-bold text-gray-700">
              DOCMUSE <span className="text-blue-500">AI</span>
            </h2>
            <img
              src="/logo.png"
              alt="Docmuse AI"
              className="h-7 lg:block hidden"
            />
            <svg
              className="w-6 h-6 text-gray-600 lg:hidden cursor-pointer"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              onClick={() => setIsSidebarOpen(false)}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <form onSubmit={handlePdfSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste PDF URL ..."
                value={pdfLink}
                onChange={(e) => setPdfLink(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isProcessing}
              />
              <label className="w-12 h-10 flex justify-center items-center bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 active:bg-gray-300 transition-all">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                />
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </label>
            </div>
            <button
              type="submit"
              disabled={isProcessing || !pdfLink}
              className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 ${
                isProcessing || !pdfLink ? "cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <span>Processing...</span>
                </div>
              ) : (
                "Add Document"
              )}
            </button>
          </form>
        </div>

        <div className="flex-grow overflow-y-auto p-6 py-4">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Your Documents
          </h3>
          {pdfLinks.length > 0 ? (
            <div className="space-y-3">
              {pdfLinks.map((pdf, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all cursor-pointer bg-gray-100 ${
                    selectedPdf === pdf.url
                      ? "bg-blue-50 border-2 border-blue-500"
                      : "hover:bg-gray-200 border-2 border-transparent"
                  }`}
                >
                  <div
                    className="flex items-center space-x-3"
                    onClick={() => {
                      selectPdf(pdf.url);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className={`w-6 h-6 ${
                          selectedPdf === pdf.url
                            ? "text-blue-500"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {pdf.title || "Untitled PDF"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePdf(pdf.url);
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">No documents added yet</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-2">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              How to get API key and get started?
              <svg
                className={`w-4 h-4 ml-1 transform transition-transform ${
                  showInstructions ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {showInstructions && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
              <ol className="list-decimal pl-4 space-y-1">
                <li>
                  Visit{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click on "Create API key"</li>
                <li>Copy and paste the API key here</li>
                <li>
                  Use this demo PDF URL to test the app:
                  <br />
                  <p className="text-blue-600 hover:underline">
                    https://docmuse.onrender.com/demo.pdf
                  </p>
                </li>
              </ol>
            </div>
          )}

          <div className="relative">
            <input
              type={`${isEditingKey ? "text" : "password"}`}
              placeholder="Enter Gemini API Key"
              value={apiKey}
              onChange={handleApiKeyChange}
              disabled={!isEditingKey}
              className={`w-full px-4 py-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !isEditingKey ? "bg-gray-50" : "bg-white"
              }`}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
              {isEditingKey ? (
                <button
                  onClick={handleSaveKey}
                  className="p-1.5 text-green-600 hover:text-green-800"
                  title="Save API key"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingKey(true)}
                  className="p-1.5 text-gray-600 hover:text-gray-800"
                  title="Edit API key"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
