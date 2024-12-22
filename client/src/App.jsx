import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [pdfLink, setPdfLink] = useState("");
  const [pdfLinks, setPdfLinks] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("docmuseAPI") || ""
  );

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedLinks = JSON.parse(localStorage.getItem("pdfLinks") || "[]");
    setPdfLinks(savedLinks);
  }, []);

  const getPdfTitle = async (url) => {
    try {
      const response = await fetch(`${baseURL}/get-pdf-title`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: url }),
      });
      const data = await response.json();
      return data.title;
    } catch (err) {
      console.error("Error getting PDF title:", err);
      toast.error("Failed to get PDF title");
      return null;
    }
  };

  const isPdfUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.toLowerCase().endsWith(".pdf");
    } catch (e) {
      return false;
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfLink) return;

    if (!isPdfUrl(pdfLink)) {
      toast.error("Please enter a valid PDF URL");
      return;
    }

    if (pdfLinks.some((pdf) => pdf.url === pdfLink)) {
      toast.error("This PDF has already been added");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${baseURL}/set-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: pdfLink }),
      });

      if (!response.ok) throw new Error("Failed to add PDF");

      const title = await getPdfTitle(pdfLink);
      const newPdf = { url: pdfLink, title };
      const newLinks = [...pdfLinks, newPdf];

      setPdfLinks(newLinks);
      localStorage.setItem("pdfLinks", JSON.stringify(newLinks));
      setSelectedPdf(pdfLink);
      setPdfLink("");
      setConversation([]);
      toast.success(`PDF "${title || "Untitled"}" added successfully!`);
    } catch (err) {
      console.error("Error setting PDF:", err);
      toast.error("Failed to add PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectPdf = async (url) => {
    const loadingToast = toast.loading("Switching PDF...");
    try {
      const response = await fetch(`${baseURL}/set-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: url }),
      });

      if (response.ok) {
        setSelectedPdf(url);
        setConversation([]);
        const selectedPdfData = pdfLinks.find((pdf) => pdf.url === url);
        toast.success(`Switched to "${selectedPdfData?.title || "Untitled"}"`, {
          id: loadingToast,
        });
      }
    } catch (err) {
      console.error("Error selecting PDF:", err);
      toast.error("Failed to switch PDF", {
        id: loadingToast,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!apiKey) {
      toast.error("Please enter your Gemini API key");
      return;
    }

    if (!question) return;

    setConversation([...conversation, { text: question, sender: "user" }]);
    setQuestion("");

    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/ask-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Invalid API key");
          return;
        }
        throw new Error("Request failed");
      }

      const data = await response.json();

      if (data.answer) {
        setConversation((prev) => [
          ...prev,
          { text: data.answer, sender: "bot" },
        ]);
      }
    } catch (err) {
      console.error("Error occurred while processing the request.", err);
      toast.error("Failed to get response");
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

  const deletePdf = (url) => {
    const newLinks = pdfLinks.filter((pdf) => pdf.url !== url);
    setPdfLinks(newLinks);
    localStorage.setItem("pdfLinks", JSON.stringify(newLinks));

    if (selectedPdf === url) {
      setSelectedPdf(null);
      setConversation([]);
    }

    toast.success("PDF removed successfully");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        pdfLink={pdfLink}
        setPdfLink={setPdfLink}
        handlePdfSubmit={handlePdfSubmit}
        pdfLinks={pdfLinks}
        selectedPdf={selectedPdf}
        selectPdf={selectPdf}
        isLoading={isProcessing}
        deletePdf={deletePdf}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
      <div className="flex-1 flex items-center justify-center">
        <ChatContainer
          chatContainerRef={chatContainerRef}
          conversation={conversation}
          setQuestion={setQuestion}
          question={question}
          handleSubmit={handleSubmit}
          loading={loading}
          selectedPdf={selectedPdf}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 bg-black/50 z-5`}
          onClick={() => {
            setIsSidebarOpen(false);
          }}
        />
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default App;
