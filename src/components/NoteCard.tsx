import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NoteCardProps {
  title?: string;
  date?: string;
  summary?: string;
  transcription?: string;
  audioUrl?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onDelete?: () => void;
  onPlay?: () => void;
}

const NoteCard = ({
  title = "Voice Note",
  date = new Date().toLocaleDateString(),
  summary = "This is a sample voice note summary. It contains the key points from the recording.",
  transcription = "This is the full transcription of the voice note. It contains all the details and context from the recording. The text can be quite long and will be displayed when the card is expanded.",
  audioUrl = "",
  isExpanded = false,
  onToggleExpand = () => {},
  onDelete = () => {},
  onPlay = () => {},
}: NoteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-[350px] bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">
              {title}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-400">{date}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-300">{summary}</p>

            <motion.div
              className={cn(
                "overflow-hidden",
                isExpanded ? "max-h-[500px]" : "max-h-0",
              )}
              initial={false}
              animate={{ maxHeight: isExpanded ? 500 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <p className="mt-4 text-sm text-gray-400">{transcription}</p>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
            onClick={onPlay}
          >
            <Play className="h-4 w-4" />
            Play
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default NoteCard;
