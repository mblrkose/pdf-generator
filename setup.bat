@echo off
REM Quick Setup Script for PDF Bypass (Windows)

echo.
echo 🚀 PDF Bypass - AI Integration Setup
echo ======================================
echo.
echo Step 1: Getting your FREE Groq API key...
echo 📌 Visit: https://console.groq.com/
echo    - Sign up with your email (no credit card needed)
echo    - Go to 'API Keys' section
echo    - Create a new API key
echo    - Copy the key
echo.
echo Step 2: Creating .env.local file...
set /p API_KEY="Enter your Groq API key: "

if "%API_KEY%"=="" (
  echo ❌ API key is required!
  pause
  exit /b 1
)

(
  echo VITE_GROQ_API_KEY=%API_KEY%
) > .env.local

echo ✅ .env.local created successfully!
echo.
echo Step 3: Installing dependencies...
call npm install

echo.
echo ✅ Setup complete! Running dev server...
call npm run dev
pause
