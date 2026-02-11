/**
 * FILE: LiveAudio.tsx
 * DESCRIPTION: This React page enables real-time voice recording for emotion analysis.
 * CONTRIBUTION: 
 * 1. Captures live audio from the user's microphone using the Web Audio API (AudioContext).
 * 2. Implements a custom WAV encoder to ensure audio consistency across different platforms.
 * 3. Sends the recorded WAV data to the backend '/api/predict' for instant analysis.
 * 4. Manages the recording timer and provides an interactive UI for starting/stopping the capture.
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, Square, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmotionResult from "@/components/EmotionResult";

const LiveAudio = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [result, setResult] = useState<{ emotion: string; explanation: string } | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioDataRef = useRef<Float32Array[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      audioDataRef.current = [];

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        audioDataRef.current.push(new Float32Array(inputData));
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      setIsRecording(false);

      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Combine chunks
      const totalLength = audioDataRef.current.reduce((acc, curr) => acc + curr.length, 0);
      const result = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of audioDataRef.current) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      const wavBlob = encodeWAV(result, 16000);
      analyzeAudio(wavBlob);
    }
  };

  const encodeWAV = (samples: Float32Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    const length = samples.length;
    let index = 44;
    for (let i = 0; i < length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      index += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  };

  const analyzeAudio = async (audioBlob: Blob) => {
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "live_recording.webm");

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze live audio");
      }

      const data = await response.json();
      setResult({
        emotion: data.emotion,
        explanation: data.explanation,
      });
    } catch (error) {
      console.error("Error analyzing live audio:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setRecordingTime(0);
  };

  if (result) {
    return <EmotionResult emotion={result.emotion} explanation={result.explanation} onReset={handleReset} />;
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
            Live Recording
          </h1>
          <p className="text-muted-foreground text-lg">
            Speak naturally and we'll analyze your emotions
          </p>
        </motion.div>

        {/* Recording area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="w-full card-elevated p-12"
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
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
                <p className="text-muted-foreground">Analyzing your voice...</p>
              </motion.div>
            ) : isRecording ? (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                {/* Recording indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 recording-dot" />
                  <span className="text-red-500 text-sm font-medium uppercase tracking-wider">Recording</span>
                </div>

                {/* Mic with pulse animation */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="pulse-ring w-full h-full bg-red-500/20" />
                  <div className="pulse-ring w-full h-full bg-red-500/20" style={{ animationDelay: "0.6s" }} />
                  <div className="absolute inset-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mic className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Waveform */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-red-500 rounded-full"
                      animate={{ height: [8, 32, 8] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.08,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>

                {/* Timer */}
                <p className="text-4xl font-semibold text-white tracking-tight mb-8 font-mono">
                  {formatTime(recordingTime)}
                </p>

                {/* Stop button */}
                <Button
                  variant="destructive"
                  size="lg"
                  className="h-14 px-8 text-base font-medium"
                  onClick={stopRecording}
                >
                  <Square className="w-4 h-4" />
                  Stop Recording
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startRecording}
                  className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Mic className="w-12 h-12 text-white" />
                </motion.button>
                <p className="text-white font-medium text-lg mb-2">Tap to start recording</p>
                <p className="text-muted-foreground text-sm mb-8">
                  We'll analyze your voice when you stop
                </p>

                <Button
                  variant="default"
                  size="lg"
                  className="h-14 px-8 text-base font-medium"
                  onClick={startRecording}
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveAudio;
