const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enhanced CORS configuration
app.use(
  cors({
    origin: "*", // Allow all origins for development flexibility
    credentials: false, // Set to false when using wildcard origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files (for generated audio and uploaded images)
app.use(
  "/media",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, path) => {
      // Set proper headers for different file types
      if (path.endsWith(".wav") || path.endsWith(".mp3")) {
        res.setHeader("Content-Type", "audio/wav");
      } else if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      }
    },
  })
);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api", require("./src/routes/story"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "StoryLens API is running",
    timestamp: new Date().toISOString(),
    env: {
      port: PORT,
      nodeEnv: process.env.NODE_ENV,
    },
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
  });
});

app.listen(PORT, () => {
  console.log(`StoryLens server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Static files: http://localhost:${PORT}/media/`);
});
