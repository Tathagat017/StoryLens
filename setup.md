# StoryLens Setup Guide

## Required: Hugging Face API Token

To use the real AI models, you need a Hugging Face API token:

1. **Get a Hugging Face Account**

   - Go to https://huggingface.co/
   - Sign up for a free account

2. **Generate API Token**

   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Give it a name like "StoryLens"
   - Select "Read" permissions
   - Copy the generated token

3. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory:

   ```env
   PORT=5000
   NODE_ENV=development
   HUGGING_FACE_API_TOKEN=your_actual_token_here
   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=uploads
   ```

## Models Used

- **Image Captioning**: `Salesforce/blip-image-captioning-large`
- **Story Generation**: `gpt2`
- **Text-to-Speech**: `microsoft/speecht5_tts` (primary), `facebook/mms-tts-eng` (fallback)

## Installation Steps

1. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

3. **Set Environment Variables**

   - Create `.env` file in backend directory
   - Add your Hugging Face API token

4. **Start the Application**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Troubleshooting

- **"API token not configured"**: Make sure you've created the `.env` file with your token
- **Model loading errors**: Hugging Face models may take time to "warm up" on first use
- **Audio generation fails**: The app will fall back to silent audio if TTS fails
