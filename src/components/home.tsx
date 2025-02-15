import React, { useState, useRef } from "react";
import RecordingInterface from "./RecordingInterface";
import TranscriptionPanel from "./TranscriptionPanel";
import NotesCalendarView from "./NotesCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { startRecording, stopRecording } from "@/lib/audio";
import { transcribeAudio, generateSummary } from "@/lib/deepseek";
// Temporary ID generator until UUID is properly installed
const generateId = () => Math.random().toString(36).substr(2, 9);

interface Note {
  id: string;
  title: string;
  date: Date;
  summary: string;
  transcription: string;
  audioUrl: string;
  audioDuration: number;
}

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(
    Array(50)
      .fill(0)
      .map(() => Math.random() * 100),
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  const updateAudioData = () => {
    if (analyzerRef.current) {
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      analyzerRef.current.getByteFrequencyData(dataArray);
      setAudioData(Array.from(dataArray).slice(0, 50));
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    }
  };

  const handleStartRecording = async () => {
    try {
      const [mediaRecorder, audioContext, analyzer] = await startRecording();
      mediaRecorderRef.current = mediaRecorder;
      audioContextRef.current = audioContext;
      analyzerRef.current = analyzer;
      setIsRecording(true);
      updateAudioData();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const handleStopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);

      // Clean up audio visualization
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      // Get the audio data
      const audioBlob = await stopRecording(mediaRecorderRef.current);

      // Stop all tracks in the stream
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());

      try {
        // Process audio with Groq
        const transcription = await transcribeAudio(audioBlob);
        setCurrentTranscription(transcription);

        // Generate summary
        const summary = await generateSummary(transcription);

        // Create audio URL and get duration
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const audioDuration = await new Promise<number>((resolve) => {
          audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
          });
        });

        // Create new note
        const newNote: Note = {
          id: generateId(),
          title: `Voice Note ${notes.length + 1}`,
          date: new Date(),
          summary,
          transcription,
          audioUrl,
          audioDuration,
        };

        setNotes((prev) => [newNote, ...prev]);
      } catch (error) {
        console.error("Groq API error:", error);
        setCurrentTranscription(
          "Error processing the recording. Please try again.",
        );
      }
    } catch (error) {
      console.error("Failed to process recording:", error);
      setCurrentTranscription(
        "Error processing the recording. Please try again.",
      );
    } finally {
      setIsProcessing(false);
      // Reset refs
      mediaRecorderRef.current = null;
      audioContextRef.current = null;
      analyzerRef.current = null;
    }
  };

  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white">Voice Notes</h1>

        <Tabs defaultValue="record" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-gray-800/50">
            <TabsTrigger
              value="record"
              className="data-[state=active]:bg-gray-700"
            >
              Record
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-gray-700"
            >
              My Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-8 mt-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
              <RecordingInterface
                isRecording={isRecording}
                audioData={audioData}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
              />

              <TranscriptionPanel
                transcription={
                  isProcessing
                    ? "Processing recording..."
                    : currentTranscription
                }
                isPlaying={false}
                currentTime={0}
                duration={180}
              />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <NotesCalendarView
              notes={notes}
              onNoteDelete={(id) =>
                setNotes((prev) => prev.filter((note) => note.id !== id))
              }
              onNotePlay={(id) => {
                const note = notes.find((n) => n.id === id);
                if (note) {
                  const audio = new Audio(note.audioUrl);
                  audio.play();
                }
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
