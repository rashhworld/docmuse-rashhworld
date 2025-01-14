# DocMuse AI - PDF Chat Application

DocMuse AI is an interactive application that allows users to chat with their PDF documents. Upload a PDF or provide a URL, and start asking questions about its content.

## Features

- 📄 PDF document upload and URL support
- 💬 Interactive chat interface with PDF content
- 🔄 Multiple document management
- 🔐 Secure API key management
- 📱 Responsive design for all devices

## Tech Stack

### Frontend

- React 18
- TailwindCSS
- React Hot Toast

### Backend

- Express.js
- Node-fetch
- PDF-parse

## Screenshot

![App Screenshot](https://docmuse.onrender.com/screenshot.png)

## Usage

- Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Enter your API key in the application
- Upload a PDF or provide a PDF URL
- Start asking questions about your document

## Project Structure

### Frontend

- `/client/src/components/` - React components
- `/client/src/App.jsx` - Main application component
- `/client/src/App.css` - Global styles
- `/client/package.json` - Frontend dependencies

### Backend

- `/server/index.js` - Express server and API endpoints
- `/server/package.json` - Backend dependencies

## Installation Guide

Follow these detailed steps to set up and run DocMuse AI on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (Latest LTS version recommended)
- npm (comes with Node.js)
- Git

### Step-by-Step Installation

#### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone https://github.com/rashhworld/docmuse-rashhworld.git
```

Navigate to the project directory:

```bash
cd docmuse-rashhworld
```

#### 2. Frontend Setup

Navigate to client directory:

```bash
cd client
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

#### 3. Backend Setup

Navigate to server directory:

```bash
cd ../server
```

Install backend dependencies:

```bash
npm install
```

Start the server:

```bash
node index
```

### Verification

1. Frontend should be running at: `http://localhost:5173`
2. Backend should be running at: `http://localhost:3000`

### Common Issues

- If ports 5173 or 3000 are already in use, the servers will attempt to use the next available port
- Ensure all dependencies are properly installed before starting the servers
- Check that the API url inside `.env` file points to correctly (client directory)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgements

- Google Gemini AI for the language model
- pdf-parse for PDF processing
