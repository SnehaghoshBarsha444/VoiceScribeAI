export const startRecording = async (): Promise<
  [MediaRecorder, AudioContext, AnalyserNode]
> => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;
  source.connect(analyzer);

  mediaRecorder.start();

  return [mediaRecorder, audioContext, analyzer];
};

export const stopRecording = (mediaRecorder: MediaRecorder): Promise<Blob> => {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
      resolve(blob);
    };

    mediaRecorder.stop();
  });
};
