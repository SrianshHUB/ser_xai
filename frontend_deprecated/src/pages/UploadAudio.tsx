/**
 * FILE: UploadAudio.tsx
 * DESCRIPTION: This React page allows users to upload pre-recorded audio files for analysis.
 * CONTRIBUTION: 
 * 1. Provides a drag-and-drop interface for selecting audio files.
 * 2. Communicates with the Flask '/api/predict' endpoint by sending audio data as FormData.
 * 3. Handles the 'loading' state and displays visual feedback during prediction.
 * 4. Passes the prediction results (emotion and explanation) to the EmotionResult component.
 */
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, FileAudio, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmotionResult from "@/components/EmotionResult";

const UploadAudio = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [result, setResult] = useState<{ emotion: string; explanation: string; traits?: any } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze audio");
      }

      const data = await response.json();
      setResult({
        emotion: data.emotion,
        explanation: data.explanation,
        traits: data.traits,
      });
    } catch (error) {
      console.error("Error analyzing audio:", error);
      // You might want to show a toast or error message here
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
  };

  if (result) {
    return <EmotionResult emotion={result.emotion} explanation={result.explanation} traits={result.traits} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-muted-foreground hover:text-white -ml-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-3">
            Upload Audio
          </h1>
          <p className="text-muted-foreground text-lg">
            Select a file to analyze its emotional content
          </p>
        </motion.div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full card-elevated p-12 cursor-pointer transition-all duration-300 ${isDragOver ? "border-white/20 bg-white/[0.02]" : ""
            } ${file ? "border-white/20" : "border-dashed border-white/10"}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <FileAudio className="w-7 h-7 text-white" />
                </div>
                <p className="text-white font-medium text-lg mb-1">{file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <Upload className="w-7 h-7 text-white/60" />
                </div>
                <p className="text-white font-medium text-lg mb-1">
                  Drop your audio file here
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse • WAV, MP3, M4A supported
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Analyze button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 w-full"
        >
          <Button
            variant="default"
            size="lg"
            className="w-full h-14 text-base font-medium"
            disabled={!file || isAnalyzing}
            onClick={handleAnalyze}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Emotion"
            )}
          </Button>
        </motion.div>

        {/* Analyzing state */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/40 rounded-full"
                    animate={{ height: [12, 28, 12] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <p className="text-muted-foreground text-sm">Processing audio...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UploadAudio;
