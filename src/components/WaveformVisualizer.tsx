import React from "react";
import { motion } from "framer-motion";

interface WaveformVisualizerProps {
  audioData?: number[];
  isRecording?: boolean;
}

const WaveformVisualizer = ({
  audioData = Array(50)
    .fill(0)
    .map(() => Math.random() * 100),
  isRecording = false,
}: WaveformVisualizerProps) => {
  return (
    <div className="w-[500px] h-[120px] bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 flex items-center justify-center border border-white/10">
      <div className="flex items-center space-x-1 h-full w-full">
        {audioData.map((value, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-t from-violet-500 to-indigo-500 w-2 rounded-full"
            initial={{ height: 2 }}
            animate={{
              height: isRecording ? Math.max(4, value) : 2,
              opacity: isRecording ? 1 : 0.5,
            }}
            transition={{
              duration: 0.1,
              ease: "easeInOut",
            }}
            style={{
              filter: isRecording
                ? "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))"
                : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WaveformVisualizer;
