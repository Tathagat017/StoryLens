const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { pipeline } = require("@huggingface/transformers");

// Load environment variables
require("dotenv").config();

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "image-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Initialize pipelines (will be loaded on first use)
let imageToTextPipeline = null;
let textToSpeechPipeline = null;

// Function to get or initialize the image-to-text pipeline
async function getImageToTextPipeline() {
  if (!imageToTextPipeline) {
    console.log("Loading TrOCR image-to-text pipeline...");
    imageToTextPipeline = await pipeline(
      "image-to-text",
      "Xenova/trocr-base-handwritten",
      {
        quantized: true,
      }
    );
    console.log("TrOCR pipeline loaded successfully!");
  }
  return imageToTextPipeline;
}

// Function to get or initialize the text-to-speech pipeline
async function getTextToSpeechPipeline() {
  if (!textToSpeechPipeline) {
    console.log("Loading text-to-speech pipeline...");
    try {
      textToSpeechPipeline = await pipeline(
        "text-to-speech",
        "Xenova/speecht5_tts",
        {
          quantized: true,
        }
      );
      console.log("Text-to-speech pipeline loaded successfully!");
    } catch (error) {
      console.log("Text-to-speech pipeline not available:", error.message);
      textToSpeechPipeline = null;
    }
  }
  return textToSpeechPipeline;
}

// Function to generate story from image using TrOCR
async function generateStoryFromImage(imagePath) {
  try {
    console.log("Starting image analysis with TrOCR...");

    // Get the image-to-text pipeline
    const captioner = await getImageToTextPipeline();

    // Perform OCR on the image
    console.log("Performing OCR on image...");
    const result = await captioner(imagePath);

    console.log("OCR result:", result);

    // Extract the text from the result
    let extractedText = "";
    if (Array.isArray(result) && result.length > 0) {
      extractedText = result[0].generated_text || "";
    } else if (result && result.generated_text) {
      extractedText = result.generated_text;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the image");
    }

    console.log("Extracted text:", extractedText);

    // Create a story based on the extracted text
    const story = createStoryFromText(extractedText);

    console.log("Generated story:", story);
    return story;
  } catch (error) {
    console.error("Error in generateStoryFromImage:", error);
    throw error;
  }
}

// Function to create a story from extracted text
function createStoryFromText(extractedText) {
  const text = extractedText.trim();

  // If the text is very short, expand it into a story
  if (text.length < 50) {
    return `${text}.`;
  }

  // If it's longer text, create a narrative around it
  return `${text}`;
}

// Function to generate audio from text using TTS
async function generateAudioFromText(text, outputPath) {
  try {
    console.log("Starting TTS generation...");

    // Get the text-to-speech pipeline
    const tts = await getTextToSpeechPipeline();

    if (!tts) {
      throw new Error("Text-to-speech pipeline not available");
    }

    // Limit text length for TTS (recommended for better quality)
    const ttsText = text.substring(0, 500);
    console.log("TTS text length:", ttsText.length);

    console.log("Generating audio...");
    const result = await tts(ttsText);

    if (result && result.audio) {
      // Save the audio file
      const audioBuffer = Buffer.from(result.audio);
      fs.writeFileSync(outputPath, audioBuffer);
      console.log("Audio saved successfully to:", outputPath);
      return outputPath;
    } else {
      throw new Error("No audio data generated");
    }
  } catch (error) {
    console.error("Error in generateAudioFromText:", error);
    throw error;
  }
}

// POST /upload - Main endpoint for image upload and story generation
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("=== New upload request ===");

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    const imageFilename = req.file.filename;

    console.log(`Processing image: ${imageFilename}`);
    console.log(`Image path: ${imagePath}`);
    console.log(`File exists: ${fs.existsSync(imagePath)}`);

    // Generate story from image using TrOCR
    console.log("Starting story generation...");
    let story;
    try {
      story = await generateStoryFromImage(imagePath);
    } catch (storyError) {
      console.error("Story generation failed:", storyError);
      return res.status(500).json({
        error: "Failed to extract text from image",
        details: storyError.message,
      });
    }

    // Generate audio from story
    console.log("Starting audio generation...");
    let audioFilename = null;
    try {
      const audioPath = path.join(uploadsDir, `audio-${Date.now()}.wav`);
      await generateAudioFromText(story, audioPath);
      audioFilename = path.basename(audioPath);
      console.log("Audio generation successful");
    } catch (audioError) {
      console.error("Audio generation failed:", audioError);
      // Continue without audio - don't fail the entire request
    }

    // Return response
    const response = {
      success: true,
      story: story,
      image: `/media/${imageFilename}`,
    };

    if (audioFilename) {
      response.audio = `/media/${audioFilename}`;
    }

    console.log("=== Request completed successfully ===");
    res.json(response);
  } catch (error) {
    console.error("Upload endpoint error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// GET /debug - Debug endpoint to check pipeline status
router.get("/debug", async (req, res) => {
  try {
    const status = {
      imageToText: imageToTextPipeline ? "loaded" : "not loaded",
      textToSpeech: textToSpeechPipeline ? "loaded" : "not loaded",
      uploadsDir: uploadsDir,
      uploadsDirExists: fs.existsSync(uploadsDir),
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
