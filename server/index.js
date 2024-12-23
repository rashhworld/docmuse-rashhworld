const express = require("express");
const fetch = require("node-fetch");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let currentPdfPath = null;
const geminiURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=";

const isPdfUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.toLowerCase().endsWith('.pdf');
  } catch (e) {
    return false;
  }
};

const isPdfAccessible = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('PDF not accessible');
    const contentType = response.headers.get('content-type');
    return contentType && contentType.includes('application/pdf');
  } catch (e) {
    return false;
  }
};

app.get("/", (req, res) => {
  res.status(200).send({ status: "success", msg: "API is working well." });
});

app.post("/set-pdf", async (req, res) => {
  try {
    const { pdfUrl } = req.body;

    if (!isPdfUrl(pdfUrl)) {
      return res.status(400).json({ status: "error", msg: "Invalid PDF URL format" });
    }

    if (!(await isPdfAccessible(pdfUrl))) {
      return res.status(400).json({ status: "error", msg: "PDF is not accessible" });
    }

    const response = await fetch(pdfUrl);
    const buffer = await response.buffer();
    const pdfData = await pdfParse(buffer);

    if (pdfData.numpages > 50) {
      return res.status(400).json({
        status: "error",
        msg: "Please upload a file with no more than 50 pages."
      });
    }

    currentPdfPath = pdfUrl;
    res.status(200).json({ status: "success", msg: "PDF URL updated successfully" });
  } catch (error) {
    console.error("Error setting PDF URL:", error);
    res.status(500).json({ status: "error", msg: "Failed to set PDF URL" });
  }
});

app.post("/ask-question", async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ status: "error", msg: "API key is required" });
    }

    const testResponse = await fetch(`${geminiURL}${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "test" }] }]
      })
    });

    if (!testResponse.ok) {
      return res.status(401).json({ status: "error", msg: "Invalid API key" });
    }

    if (!currentPdfPath) {
      return res.status(400).json({ status: "error", msg: "No PDF selected" });
    }

    const question = req.body.question;

    const response = await fetch(currentPdfPath);
    if (!response.ok) throw new Error('Failed to fetch PDF');

    const buffer = await response.buffer();
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Here is the text from the PDF:\n${text}\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    };

    const geminiResponse = await fetch(`${geminiURL}${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates[0].content.parts[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ status: "success", answer });
    } else {
      return res.status(500).json({
        status: "error",
        msg: "Sorry, I didn't understand your question.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ status: "error", msg: "An error occurred" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
