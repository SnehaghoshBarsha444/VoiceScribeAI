import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Convert webm to mp3 if needed (OpenAI prefers mp3)
    const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
      response_format: "text",
    });

    return response;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const generateSummary = async (
  transcription: string,
): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that creates concise summaries of voice notes.",
        },
        {
          role: "user",
          content: `Please provide a brief summary of this transcription: ${transcription}`,
        },
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Summary generation error:", error);
    throw error;
  }
};
