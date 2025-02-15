import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

export const generateSummary = async (
  transcription: string,
): Promise<string> => {
  try {
    const chatCompletion = await groq.chat.completions.create({
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
      model: "deepseek-r1-distill-llama-70b",
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Summary generation error:", error);
    throw error;
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    // Create FormData and append the audio file
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "distil-whisper-large-v3-en");

    // Make direct fetch call to Groq's audio transcription endpoint
    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groq.apiKey}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};
