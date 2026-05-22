# PDF Bypass - AI Integration Setup Guide

## Getting Your Free Groq API Key

This project now uses **Groq API** to generate realistic academic content for PDFs. Groq is completely free and requires no credit card.

### Step 1: Sign Up for Groq (Free)
1. Visit [https://console.groq.com/](https://console.groq.com/)
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Verify your email
5. You're done! No credit card needed, fully free.

### Step 2: Get Your API Key
1. After login, go to the **"API Keys"** section in the sidebar
2. Click **"Create New API Key"**
3. Name it something like `pdf-bypass` (optional)
4. Copy the API key

### Step 3: Add API Key to Your Project
1. In the project root directory, create a file named `.env.local`
2. Add this line:
   ```
   VITE_GROQ_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with the key you copied in Step 2

3. **Important:** Never commit `.env.local` to Git (it's already in .gitignore)

### Step 4: Run the Project
```bash
npm install
npm run dev
```

The app should now generate proper academic content instead of Lorem Ipsum!

## How It Works

- **Free Tier:** Groq offers a free tier with generous rate limits (perfect for this use case)
- **AI Model:** Uses Mixtral-8x7b (a high-quality open-source model)
- **Content:** Generates realistic academic essays on various topics
- **Quality:** Output is suitable for platforms that check for coherent, human-like writing

## Features

✅ Completely free (no credit card)  
✅ Fast inference (Groq is optimized for speed)  
✅ Realistic academic content  
✅ Multiple topics for variety  
✅ Proper formatting for PDFs  

## Troubleshooting

**Error: "Groq API key not found"**
- Make sure `.env.local` file exists in the project root
- Check that `VITE_GROQ_API_KEY=...` is set correctly
- Restart the dev server after adding the key (`npm run dev`)

**Error: "Groq API error"**
- Check your API key is correct at [https://console.groq.com/api-keys](https://console.groq.com/api-keys)
- Make sure you have API access enabled in your Groq account
- Check your rate limits (free tier has limits but they're generous)

**Slow generation?**
- Groq API is generally fast, but first request might be slower
- Multiple PDFs will take longer due to sequential generation
- This is expected and normal behavior

## Rate Limits

Groq's free tier provides:
- **Requests:** Good enough for normal usage
- **Tokens:** ~30K tokens per minute per model
- **Concurrent:** 1 concurrent request

This is perfectly fine for generating academic PDFs!

## Next Steps

1. Generate PDFs with realistic content
2. The text quality will be much better than Lorem Ipsum
3. Course Hero and similar platforms will accept these more readily
4. Metadata is still spoofed as "Microsoft Word" documents for extra authenticity

Enjoy! 🚀
