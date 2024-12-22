const express = require("express");
const fetch = require("node-fetch");
const pdfParse = require("pdf-parse");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

let currentPdfPath = null;

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
      return res.status(400).json({ error: "Invalid PDF URL format" });
    }

    if (!(await isPdfAccessible(pdfUrl))) {
      return res.status(400).json({ error: "PDF is not accessible" });
    }

    currentPdfPath = pdfUrl;
    res.status(200).json({ message: "PDF URL updated successfully" });
  } catch (error) {
    console.error("Error setting PDF URL:", error);
    res.status(500).json({ error: "Failed to set PDF URL" });
  }
});

app.post("/get-pdf-title", async (req, res) => {
  try {
    const { pdfUrl } = req.body;

    if (!isPdfUrl(pdfUrl)) {
      return res.status(400).json({ error: "Invalid PDF URL format" });
    }

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const buffer = await response.buffer();
    const pdfData = await pdfParse(buffer);

    let title = pdfData.info.Title || '';

    if (!title) {
      const firstLine = pdfData.text.split('\n')[0];
      title = firstLine.slice(0, 50).trim() + (firstLine.length > 50 ? '...' : '');
    }

    res.json({ title: title || 'Untitled PDF' });
  } catch (error) {
    console.error("Error getting PDF title:", error);
    res.status(500).json({ error: "Failed to get PDF title" });
  }
});

app.post("/ask-question", async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
      return res.status(401).json({ error: "API key is required" });
    }

    if (!currentPdfPath) {
      return res.status(400).json({ error: "No PDF selected" });
    }

    const question = req.body.question;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(currentPdfPath);
    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

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

    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await geminiResponse.json();

    if (data.candidates && data.candidates[0].content.parts[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      return res.json({ answer });
    } else {
      return res.status(500).json({
        error: "Sorry, I didn't understand your question.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
