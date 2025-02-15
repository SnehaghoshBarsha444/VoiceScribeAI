import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

interface TranscriptionPanelProps {
  transcription?: string;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
}

const TranscriptionPanel = ({
  transcription = "This is a sample transcription of the recorded audio. The text will update in real-time as the audio is being transcribed by our AI system. You can play, pause, and seek through the audio while following along with the transcription.",
  isPlaying = false,
  currentTime = 0,
  duration = 180,
  onPlay = () => {},
  onPause = () => {},
  onSeek = () => {},
}: TranscriptionPanelProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-[800px] h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col border-0 shadow-2xl overflow-hidden">
      <CardContent className="flex-1 p-6 flex flex-col gap-6">
        <ScrollArea className="flex-1 rounded-xl border border-white/10 p-4 bg-gray-800/50 backdrop-blur-lg">
          <p className="text-sm leading-relaxed text-gray-300">
            {transcription}
          </p>
        </ScrollArea>

        <div className="space-y-4">
          {/* Progress bar */}
          <div
            className="relative w-full h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              onSeek(percentage * duration);
            }}
          >
            <motion.div
              className="absolute h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
              animate={{
                boxShadow: isPlaying
                  ? [
                      "0 0 10px rgba(139, 92, 246, 0.5)",
                      "0 0 20px rgba(139, 92, 246, 0.5)",
                    ]
                  : "none",
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => onSeek(Math.max(0, currentTime - 10))}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                onClick={isPlaying ? onPause : onPlay}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => onSeek(Math.min(duration, currentTime + 10))}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptionPanel;
