# 📸 StoryLens - AI-Powered Photo Story Generator

StoryLens is a multi-modal application that transforms images into captivating stories with AI-generated narration. Using cutting-edge machine learning models, it analyzes images to generate descriptive captions and creates engaging narratives with optional audio narration.
![image](https://github.com/user-attachments/assets/728ad943-bf7b-4ad4-a835-dea1445a2c44)

## 🌟 Features

- **Image Captioning**: Uses ViT-GPT2 to generate descriptive captions from images
- **Story Generation**: Creates engaging narratives based on image content
- **Audio Narration**: Generates audio narration using Text-to-Speech models
- **Local AI Processing**: All AI processing runs locally using Transformers.js
- **Modern UI**: Beautiful, responsive interface built with React and Mantine UI
- **Real-time Processing**: Live feedback during story generation

## 🏗️ Architecture

### Frontend

- **Framework**: React 18 with TypeScript
- **UI Library**: Mantine UI v7
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Styling**: CSS with Mantine components

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Processing**: Transformers.js (Hugging Face)
- **File Upload**: Multer
- **File System**: fs-extra

## 🤖 AI Models Used

### Image Captioning

- **Primary Model**: `Xenova/vit-gpt2-image-captioning`
- **Type**: ViT-GPT2 (Vision Transformer + GPT-2)
- **Purpose**: Generates descriptive captions from images
- **Architecture**: Vision Transformer encoder with GPT-2 decoder

### Text-to-Speech (Optional)

- **Model**: `Xenova/speecht5_tts`
- **Type**: SpeechT5 Text-to-Speech
- **Purpose**: Converts generated stories into audio narration
- **Output**: WAV audio files

## 🔧 Technology Stack

### Transformers.js Pipeline

The application uses Transformers.js pipelines for local AI processing:

```javascript
// Image Captioning Pipeline
const imageCaptioningPipeline = await pipeline(
  "image-to-text",
  "Xenova/vit-gpt2-image-captioning",
  { quantized: true }
);

// Text-to-Speech Pipeline (Optional)
const textToSpeechPipeline = await pipeline(
  "text-to-speech",
  "Xenova/speecht5_tts",
  { quantized: true }
);
```

### Key Benefits of Transformers.js

- **Local Processing**: No external API calls required
- **Privacy**: All data stays on your machine
- **Offline Capability**: Works without internet connection
- **Cost Effective**: No API usage fees
- **Fast Inference**: Optimized ONNX models for browser/Node.js
- **No API Keys**: No external API tokens or accounts required

## 📦 Dependencies

### Backend Dependencies

```json
{
  "@huggingface/transformers": "^3.1.2",
  "express": "^4.21.2",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "dotenv": "^16.4.7",
  "fs-extra": "^11.2.0"
}
```

### Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@mantine/core": "^7.15.2",
  "@mantine/hooks": "^7.15.2",
  "@tabler/icons-react": "^3.31.0",
  "axios": "^1.7.9"
}
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser
- **No external API accounts required** - All AI processing runs locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd multi-modal-application
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080
```

### 4. Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173 (or next available port)
- Backend API: http://localhost:8080
- Health Check: http://localhost:8080/health

## 📖 Usage Guide

### Basic Usage

1. **Open the Application**: Navigate to the frontend URL in your browser
2. **Upload an Image**: Click "Choose an image file" and select an image containing text
3. **Generate Story**: Click "Generate Story & Audio" to process the image
4. **View Results**: Read the generated story and listen to audio narration (if available)

### Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)

### File Size Limits

- Maximum file size: 10MB
- Recommended: Images under 5MB for faster processing

## 🔍 API Endpoints

### POST `/api/upload`

Upload an image and generate a story with optional audio.

**Request:**

- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'image' field

**Response:**

```json
{
  "success": true,
  "story": "Generated story text...",
  "image": "/media/image-filename.jpg",
  "audio": "/media/audio-filename.wav"
}
```

### GET `/api/debug`

Check the status of AI pipelines and system health.

**Response:**

```json
{
  "imageToText": "loaded",
  "textToSpeech": "loaded",
  "uploadsDir": "/path/to/uploads",
  "uploadsDirExists": true
}
```

### GET `/health`

System health check endpoint.

**Response:**

```json
{
  "status": "OK",
  "message": "StoryLens API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "env": {
    "port": 8080,
    "nodeEnv": "development"
  }
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
# Required
PORT=8080                           # Server port
NODE_ENV=development               # Environment mode
```

#### Frontend (.env)

```env
# Required
VITE_API_URL=http://localhost:8080  # Backend API URL
```

### Model Configuration

Models are automatically downloaded and cached on first use. You can configure model settings in `backend/src/routes/story.js`:

```javascript
// Customize model settings
const imageToTextPipeline = await pipeline(
  "image-to-text",
  "Xenova/trocr-base-handwritten",
  {
    quantized: true, // Use quantized models for better performance
    cache_dir: "./models", // Custom cache directory
    local_files_only: false, // Allow downloading models
  }
);
```

## 🎯 How It Works

### 1. Image Upload & Validation

- User uploads an image through the React frontend
- Multer middleware validates file type and size
- Image is saved to the uploads directory

### 2. Image Captioning

- ViT-GPT2 model analyzes the uploaded image
- Generates descriptive captions using vision transformer architecture
- Returns structured caption data

### 3. Story Generation

- Generated caption is processed by story generation logic
- Creates engaging narratives based on image content
- Expands captions into full stories with context

### 4. Audio Generation (Optional)

- Generated story is converted to speech using SpeechT5
- Audio file is saved as WAV format
- Provides fallback if TTS fails

### 5. Response Delivery

- Story text, image URL, and audio URL are returned
- Frontend displays results with audio player
- Error handling for partial failures

## 🛠️ Development

### Project Structure

```
multi-modal-application/
├── backend/
│   ├── src/
│   │   └── routes/
│   │       └── story.js          # Main API routes
│   ├── uploads/                  # File storage
│   ├── index.js                  # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main React component
│   │   └── App.css              # Styles
│   ├── package.json
│   └── .env
├── README.md
└── setup.md
```

### Development Commands

**Backend:**

```bash
npm start          # Production mode
npm run dev        # Development with nodemon
```

**Frontend:**

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Testing the AI Models

```bash
cd backend
node test-transformers.js
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Route not found" Error

- **Cause**: Incorrect API endpoint URL
- **Solution**: Ensure frontend calls `/api/upload`, not `/api/story/upload`

#### 2. Model Loading Errors

- **Cause**: Network issues or insufficient disk space
- **Solution**: Check internet connection and ensure 2GB+ free space for models

#### 3. Audio Generation Fails

- **Cause**: TTS model not available or incompatible
- **Solution**: Application continues without audio; check console logs

#### 4. Large File Upload Fails

- **Cause**: File size exceeds 10MB limit
- **Solution**: Compress image or use smaller file

### Debug Mode

Enable detailed logging by setting:

```env
NODE_ENV=development
```

Check pipeline status:

```bash
curl http://localhost:8080/api/debug
```

## 🔒 Security Considerations

- File upload validation prevents non-image files
- File size limits prevent DoS attacks
- Local AI processing ensures data privacy
- No external API calls required
- CORS configured for development flexibility

## 🚀 Deployment

### Production Deployment

1. Set environment variables for production
2. Build frontend: `npm run build`
3. Configure reverse proxy (nginx/Apache)
4. Use process manager (PM2) for backend
5. Set up SSL certificates

### Docker Deployment (Optional)

```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:

- Check the troubleshooting section
- Review console logs for errors
- Open an issue on GitHub

## 🙏 Acknowledgments

- **Hugging Face**: For Transformers.js and model hosting
- **Microsoft Research**: For TrOCR model development
- **Mantine**: For the beautiful UI components
- **React Team**: For the excellent frontend framework

---

**Built with ❤️ using Transformers.js for local AI processing**
