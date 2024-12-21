import React from "react";

const Sidebar = ({
  pdfLink,
  setPdfLink,
  handlePdfSubmit,
  pdfLinks,
  selectedPdf,
  selectPdf,
  isLoading,
  deletePdf,
}) => {
  return (
    <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between space-x-2 mb-4">
            <h2 className="text-xl font-bold text-gray-700">
              DOCMUSE <span className="text-blue-500">AI</span>
            </h2>
            <img src="/logo.png" alt="Docmuse AI" className="h-7" />
          </div>

          <form onSubmit={handlePdfSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Paste PDF URL ..."
              value={pdfLink}
              onChange={(e) => setPdfLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !pdfLink}
              className={`w-full px-4 py-3 rounded-lg font-medium transition-all bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 ${
                isLoading || !pdfLink ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
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
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
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
                    onClick={() => selectPdf(pdf.url)}
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
                      <p className="font-medium text-gray-900 truncate">
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
              <p className="mt-2 text-sm text-gray-500">No PDFs added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
