import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Mic, Square } from "lucide-react";
import WaveformVisualizer from "./WaveformVisualizer";
import { motion } from "framer-motion";

interface RecordingInterfaceProps {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
  audioData?: number[];
}

const RecordingInterface = ({
  onStartRecording = () => {},
  onStopRecording = () => {},
  isRecording = false,
  audioData = Array(50)
    .fill(0)
    .map(() => Math.random() * 100),
}: RecordingInterfaceProps) => {
  const [localIsRecording, setLocalIsRecording] = useState(isRecording);

  const handleToggleRecording = () => {
    if (localIsRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
    setLocalIsRecording(!localIsRecording);
  };

  return (
    <Card className="w-[600px] h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex flex-col items-center justify-center space-y-8 border-0 shadow-2xl">
      <motion.div
        animate={{
          scale: localIsRecording ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: localIsRecording ? Infinity : 0,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-xl opacity-50"
          animate={{
            scale: localIsRecording ? [1.2, 1.4, 1.2] : 1,
            opacity: localIsRecording ? [0.5, 0.8, 0.5] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Button
          size="lg"
          className={`w-24 h-24 rounded-full relative z-10 ${
            localIsRecording
              ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
              : "bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600"
          } border-4 border-white/10 shadow-xl`}
          onClick={handleToggleRecording}
        >
          {localIsRecording ? (
            <Square className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </Button>
      </motion.div>

      <div className="w-full flex justify-center">
        <WaveformVisualizer
          audioData={audioData}
          isRecording={localIsRecording}
        />
      </div>

      <div className="text-center">
        <p className="text-gray-300 font-medium">
          {localIsRecording
            ? "Recording in progress..."
            : "Click the microphone to start recording"}
        </p>
      </div>
    </Card>
  );
};

export default RecordingInterface;
