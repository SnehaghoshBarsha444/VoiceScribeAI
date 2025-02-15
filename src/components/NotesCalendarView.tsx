import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import NoteCard from "./NoteCard";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  date: Date;
  summary: string;
  transcription: string;
  audioUrl?: string;
}

interface NotesCalendarViewProps {
  notes?: Note[];
  onDateSelect?: (date: Date) => void;
  onNoteDelete?: (noteId: string) => void;
  onNotePlay?: (noteId: string) => void;
}

const NotesCalendarView = ({
  notes = [
    {
      id: "1",
      title: "Meeting Notes",
      date: new Date(),
      summary: "Discussion about Q2 goals and project timeline",
      transcription:
        "Detailed discussion about upcoming projects and deadlines...",
      audioUrl: "/sample-audio-1.mp3",
    },
    {
      id: "2",
      title: "Personal Reminder",
      date: new Date(Date.now() - 86400000),
      summary: "Remember to schedule dentist appointment",
      transcription:
        "Need to call dentist office to schedule annual checkup...",
      audioUrl: "/sample-audio-2.mp3",
    },
  ],
  onDateSelect = () => {},
  onNoteDelete = () => {},
  onNotePlay = () => {},
}: NotesCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateSelect(date);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      selectedDate &&
      format(note.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"),
  );

  return (
    <div className="w-full min-h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-lg shadow-2xl">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="p-4 bg-gray-800/50 backdrop-blur-lg border-white/10">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border-white/10"
          />
        </Card>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">
            Notes for{" "}
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "Selected Date"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                date={format(note.date, "PPp")}
                summary={note.summary}
                transcription={note.transcription}
                audioUrl={note.audioUrl}
                isExpanded={expandedNoteId === note.id}
                onToggleExpand={() =>
                  setExpandedNoteId(expandedNoteId === note.id ? null : note.id)
                }
                onDelete={() => onNoteDelete(note.id)}
                onPlay={() => onNotePlay(note.id)}
              />
            ))}
            {filteredNotes.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No notes found for this date
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesCalendarView;
