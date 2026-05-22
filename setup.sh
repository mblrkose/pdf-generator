#!/bin/bash
# Quick Setup Script for PDF Bypass

echo "🚀 PDF Bypass - AI Integration Setup"
echo "======================================"
echo ""
echo "Step 1: Getting your FREE Groq API key..."
echo "📌 Visit: https://console.groq.com/"
echo "   - Sign up with your email (no credit card needed)"
echo "   - Go to 'API Keys' section"
echo "   - Create a new API key"
echo "   - Copy the key"
echo ""
echo "Step 2: Creating .env.local file..."
read -p "Enter your Groq API key: " API_KEY

if [ -z "$API_KEY" ]; then
  echo "❌ API key is required!"
  exit 1
fi

cat > .env.local << EOF
VITE_GROQ_API_KEY=$API_KEY
EOF

echo "✅ .env.local created successfully!"
echo ""
echo "Step 3: Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete! Running dev server..."
npm run dev
