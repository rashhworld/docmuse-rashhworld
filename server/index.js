const express = require("express");
const fetch = require("node-fetch");
const pdfParse = require("pdf-parse");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
  process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

const pdfPath = path.join(__dirname, process.env.PDF_PATH);

app.get("/", (req, res) => {
  res.status(200).send({ status: "success", msg: "API is working well." });
});

app.post("/ask-question", async (req, res) => {
  try {
    const question = req.body.question;
    const pdfData = await pdfParse(pdfPath);
    const text = pdfData.text;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `Here is the text from the PDF:\n${text}\n\nIf anything outside the pdf is asked, just say "Sorry, I didn't understand your question. Do you want to connect with a live agent?"\n\nQuestion: ${question}`,
            },
          ],
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0]) {
      const answer = data.candidates[0].content.parts[0].text;
      return res.json({ answer });
    } else {
      return res.status(500).json({
        error:
          "Sorry, I didn't understand your question. Do you want to connect with a live agent?",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
