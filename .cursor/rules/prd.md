# Product Requirements Document (PRD)

## Product Name

**StoryLens – Multi-modal Photo Story Generator**

## Overview

StoryLens is a minimal viable product (MVP) web application that allows users to upload an image and receive an AI-generated story or poem inspired by the image, with an optional AI-generated audio narration for sharing.

---

## Features

### PHASE 1: Backend (Node.js + Express)

**Core Requirements:**

- Endpoint to upload an image.
- Integrate with `microsoft/kosmos-2` model to generate a story or poem based on the uploaded image.
- Integrate with `coqui/xtts-v2` to generate audio narration from the generated text.
- Serve the story and the corresponding audio file to the frontend.
- Store uploaded files and generated results temporarily on the server (no database required).

**API Endpoints:**

1. `POST /upload`

   - Accepts an image file.
   - Calls Kosmos-2 model for story/poem generation.
   - Calls Coqui XTTS-v2 for narration.
   - Returns JSON with `text`, `audioUrl`.

2. `GET /media/:filename`

   - Serves static files (audio/images).

**Tech Stack:**

- Node.js
- Express
- Multer (for file uploads)
- `child_process` to call local/inference API scripts for Kosmos-2 and Coqui/XTTS-v2 (MVP assumption)

---

### PHASE 2: Frontend (React + TypeScript)

**Core Requirements:**

- Simple UI with:

  - File input for uploading an image.
  - Button to trigger generation.
  - Display of generated text (story/poem).
  - Embedded audio player for narration.

**Pages/Components:**

1. **HomePage**

   - Upload image section
   - Generate button
   - Display area: story text + audio player

**Tech Stack:**

- React
- TypeScript
- Axios (for API calls)
- Mantine (optional for basic styling/UI components)

---

## Scope Notes

- Keep it minimal – no authentication, no persistence layer (DB), no advanced file management.
- All files are stored locally in a temporary folder and can be overwritten.
- No need for image preview, just show the result text + audio.
- Assume AI models are locally callable or hosted via accessible inference APIs.

---

## Folder Guidelines

- Remove all dummy/unnecessary boilerplate files.
- `backend/` only contains server logic, routes, and model wrappers.
- `frontend/` only contains basic UI and hooks for calling the backend.

---

## Milestone Plan

- **Step 1:** Clean project structure.
- **Step 2:** Implement image upload and AI integration (backend).
- **Step 3:** Build frontend to consume the API and display results.
- **Step 4:** Final testing.

---

## Completion Goal

A basic MVP web app ready to demo in minutes. No advanced error handling, styling, or production readiness needed.
