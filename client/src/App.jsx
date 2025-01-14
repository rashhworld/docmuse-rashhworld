import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import ChatContainer from "./components/ChatContainer";
const pdfApi = import.meta.env.VITE_API_PROCESS_PDF;

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

  const isPdfUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.toLowerCase().endsWith(".pdf");
    } catch (e) {
      return false;
    }
  };

  const handlePdfSubmit = async (e, link = pdfLink, filename = null) => {
    e.preventDefault();
    if (!link) return;

    const filenamePart = link.split("/").pop();

    if (!isPdfUrl(link)) {
      toast.error("Please enter a valid PDF URL");
      return;
    }

    if (pdfLinks.some((pdf) => pdf.url === link)) {
      toast.error("This PDF has already been added");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`${baseURL}/set-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: link }),
      });

      const { status, msg } = await response.json();
      if (status === "success") {
        const title = filename ?? decodeURIComponent(filenamePart);
        const newPdf = { url: link, title };
        const newLinks = [...pdfLinks, newPdf];

        setPdfLinks(newLinks);
        localStorage.setItem("pdfLinks", JSON.stringify(newLinks));
        setSelectedPdf(link);
        setPdfLink("");
        setConversation([]);
        toast.success(`PDF "${title}" added successfully!`);
      } else {
        setPdfLink("");
        filename && (await invokeDeleteAPi(filenamePart));
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
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

      const { status, msg } = await response.json();
      if (status === "success") {
        setSelectedPdf(url);
        setConversation([]);
        const selectedPdfData = pdfLinks.find((pdf) => pdf.url === url);
        toast.success(`Switched to "${selectedPdfData?.title || "Untitled"}"`, {
          id: loadingToast,
        });
      } else {
        toast.error(msg, { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
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

      const { status, msg, answer } = await response.json();
      if (status === "success") {
        setConversation((prev) => [...prev, { text: answer, sender: "bot" }]);
      } else {
        toast.error(msg);
      }
    } catch (err) {
      console.error(err);
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

  const deletePdf = async (url) => {
    const filename = url.split("/").pop();
    const newLinks = pdfLinks.filter((pdf) => pdf.url !== url);
    setPdfLinks(newLinks);
    localStorage.setItem("pdfLinks", JSON.stringify(newLinks));

    if (selectedPdf === url) {
      setSelectedPdf(null);
      setConversation([]);
    }

    await invokeDeleteAPi(filename);
    toast.success("PDF removed successfully");
  };

  const invokeDeleteAPi = async (filename) => {
    await fetch(`${pdfApi}/delete/media?user=docmuse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: filename }),
    });
  };

  return (
    <div className="flex h-[100dvh] bg-gray-100">
      <Sidebar
        pdfLink={pdfLink}
        setPdfLink={setPdfLink}
        handlePdfSubmit={handlePdfSubmit}
        pdfLinks={pdfLinks}
        selectedPdf={selectedPdf}
        selectPdf={selectPdf}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
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
