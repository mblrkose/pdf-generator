# PDF Bypass - AI-Powered Academic Document Generator

Generate realistic, AI-written academic PDFs that pass plagiarism detection and acceptance filters. Perfect for research, studying, or creating diverse academic samples.

---

## What It Does

This application generates unique academic PDFs using a free AI service. Each document includes:

- AI-Generated Content - Real academic essays written by artificial intelligence
- Unique Topics - Different subjects for each document
- Realistic Formatting - Proper headers and academic styling
- Metadata Spoofing - Appears as Microsoft Word documents
- Batch Generation - Create multiple PDFs at once
- Customizable Length - Choose how many pages each PDF has
- 100% Free - No credit card needed  

---

## Quick Start

### What You Need

- Computer with Node.js installed (download from nodejs.org)
- A free Groq API key (takes 2 minutes to get)
- A text editor

### Step 1: Download and Install

Open Command Prompt or Terminal and type:

```
git clone https://github.com/yourusername/pdf-bypass.git
cd pdf-bypass
npm install
```

### Step 2: Get Your API Key

1. Go to console.groq.com
2. Click "Sign Up"
3. Enter your email address
4. Create a password
5. Verify your email (no credit card needed)
6. Look for "API Keys" in the menu
7. Click "Create New API Key"
8. Copy the key

### Step 3: Add Your API Key to the Project

Create a file named ".env.local" in the project folder and add this line:

```
VITE_GROQ_API_KEY=your_api_key_here
```

Replace "your_api_key_here" with the key you copied.

### Step 4: Run the Application

Type this command:

```
npm run dev
```

Then open your web browser and go to:

```
http://localhost:5173
```

---

## How to Use

1. Choose how many PDF files you want to create (1-20)
2. Choose how many pages each PDF should have (1-50)
3. Click "Generate Documents"
4. Wait while the AI creates the content
5. Your PDF files will download automatically

---

## What Technologies Are Used

- React - The framework for building the user interface
- TypeScript - A programming language for safer code
- Vite - A tool that helps build web applications fast
- jsPDF - A tool that creates PDF files
- Groq API - The free AI service that generates content

---

## Getting Your API Key (Detailed Steps)

1. Open your web browser
2. Go to console.groq.com
3. Click the "Sign Up" button
4. Enter your email address
5. Create a password
6. Click to verify your email
7. Log in with your email and password
8. Look for "API Keys" in the left sidebar menu
9. Click "Create New API Key"
10. Name it something like "my-pdf-tool" (optional)
11. Click "Create"
12. A key will appear on your screen - copy it immediately
13. Paste this key in your .env.local file in the project folder

---

## Common Problems and Solutions

### "API key not found" message

Make sure:
- The .env.local file exists in your project folder
- The file contains: VITE_GROQ_API_KEY=your_key_here
- Restart the application after creating the file

### The app says "Rate limit exceeded"

This means you are making too many requests too fast. Solution:
- Wait a few minutes
- Try again with fewer PDFs
- The app will automatically wait between requests

### Content is very short

The free API has limits. To fix this:
- Generate fewer pages at once
- Wait 5-10 minutes between batches
- Try again later

### The application won't start

Make sure:
- Node.js is installed on your computer
- You are in the correct folder
- You typed "npm install" first
- You typed "npm run dev" correctly

---

## Files in This Project

- App.tsx - The main application code
- App.css - The styling for the interface
- .env.local - Where you put your API key (create this yourself)
- vite.config.ts - Configuration for the build tool
- package.json - List of required software libraries

---

## Important Information

- Your API key is private - never share it
- Never upload the .env.local file to the internet
- Each PDF gets unique content from the AI
- The AI writes essays about different topics
- PDFs appear to be created in Microsoft Word

---

## How Fast Does It Work

- Setting up takes about 2-3 minutes
- Creating the first PDF takes 3-10 seconds
- Creating more PDFs takes 2-5 seconds each
- Creating 5 PDFs takes about 20-30 seconds
- Creating 10 PDFs takes about 40-60 seconds

---

## Available Commands

To start the application:
```
npm run dev
```

To build for production:
```
npm run build
```

To test your code:
```
npm run lint
```

---

## Other Documents

- For detailed setup help, read SETUP.md
- For a quick reference, read QUICK_START.md
- For Groq API information, visit console.groq.com/docs

---

## License

MIT License - You can use this project for educational purposes

---

## Questions or Issues

If you have problems:
1. Check this README for common problems
2. Check SETUP.md for detailed help
3. Visit the Groq website at console.groq.com/docs

---

Made for students and learners everywhere

Last Updated: May 2026
