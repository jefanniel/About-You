import { useRef, useState } from 'react';
import lyricsList from '../assets/about-you-plain.json';

export default function LyricTimestampRecorder() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMark = () => {
    const audio = audioRef.current;
    if (!audio || currentIndex >= lyricsList.length) return;

    const time = parseFloat(audio.currentTime.toFixed(2));
    const updated = [...timestamps, time];
    setTimestamps(updated);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCopy = () => {
    const result = lyricsList.map((text, i) => ({
      time: timestamps[i] ?? 0,
      text
    }));

    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    alert('📋 JSON copied to clipboard!');
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold">🎵 Lyric Timestamp Recorder</h1>

      <audio ref={audioRef} controls className="w-full max-w-md">
        <source src="/about-you.mp3" type="audio/mp3" />
        Your browser does not support audio.
      </audio>

      <div className="text-xl bg-white/10 p-4 rounded-lg max-w-xl text-center">
        {lyricsList[currentIndex] ?? '✅ Selesai!'}
      </div>

      <button
        onClick={handleMark}
        disabled={currentIndex >= lyricsList.length}
        className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-xl text-lg font-semibold"
      >
        🎯 Tandai waktu lirik
      </button>

      {currentIndex >= lyricsList.length && (
        <button
          onClick={handleCopy}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-lg font-semibold"
        >
          📋 Salin JSON
        </button>
      )}
    </div>
  );
}
