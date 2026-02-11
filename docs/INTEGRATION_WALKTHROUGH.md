# Frontend Integration Walkthrough

The project has been successfully migrated from a Jinja2 template-based frontend to a modern React SPA powered by Vite and Shadcn UI.

## Key Changes

### 1. Project Restructuring
- The contents of the `frontend` folder were moved to the root to simplify the project structure.
- Old `templates/` and `static/` directories were removed.

### 2. Lovable De-branding
- Removed `lovable-tagger` from `package.json` and `vite.config.ts`.
- Replaced all "Lovable" text and meta tags in `index.html` with relevant "XAI SER" branding.

### 3. Backend Refactoring
- Updated `app.py` to:
    - Use `dist` as the static folder.
    - Serve the SPA `index.html` for all front-end routes.
    - Provide a new `/api/predict` JSON endpoint for audio analysis.

### 4. Frontend API Integration
- Refactored `UploadAudio.tsx` and `LiveAudio.tsx` to use the real `/api/predict` endpoint instead of mock delays.

## How to Run

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
2. **Run the Backend**:
   ```bash
   python backend/app.py
   ```
3. **Access the App**:
   Navigate to `http://localhost:5000` in your browser.

> [!NOTE]
> The frontend has already been built into the `dist` folder. If you make any changes to the React source code, you will need to run `npm run build` again to see the changes in the Flask app.
