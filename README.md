# XAI SER: Speech Emotion Recognition with Explainable AI

Owned by **SrianshHUB**

## Overview
XAI SER is a modern Speech Emotion Recognition (SER) application that not only predicts emotions from audio but also provides transparent explanations using SHAP (SHapley Additive exPlanations). 

The project features a React-based frontend and a Flask backend, integrating state-of-the-art machine learning with a user-friendly interface.

## Key Features
- **Real-time Prediction**: Record audio directly in the browser and get instant results.
- **Audio Upload**: Analyze existing WAV or MP3 files.
- **Explainable AI (XAI)**: Understand *why* a specific emotion was predicted through feature importance visualizations.
- **Modern UI**: Built with React, Vite, Tailwind CSS, and Shadcn UI.

## Technology Stack
- **Frontend**: React, Vite, Lucide Icons, Framer Motion, Tailwind CSS.
- **Backend**: Flask, Librosa (audio processing), Scikit-learn (ML model), SHAP (XAI), Joblib.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js & npm (for frontend development)

### Backend Setup
1. Navigate to the project root.
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Run the server:
   ```bash
   python backend/app.py
   ```

### Frontend Setup (Optional - for development)
The production build is already served by the Flask app. To modify the frontend:
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Repository Structure
- `backend/`: Flask application, ML model, and data.
- `frontend/`: React source code and UI components.
- `docs/`: Project documentation and walkthroughs.

---
Produced by **SrianshHUB**
