import { useEffect, useRef, useState } from 'react';
import lyricsJson from '../assets/about-you.json';
import AnimatedText from './AnimatedText';

// ✅ Tipe baris lirik
type LyricLine = {
  time: number;
  text: string;
  speaker?: 'matty' | 'carly';
};

// ✅ Pastikan TypeScript tahu ini array LyricLine[]
const lyricsData = lyricsJson as LyricLine[];

export default function LyricsPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeLyrics, setActiveLyrics] = useState<number[]>([]);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let timeouts: NodeJS.Timeout[] = [];

    const startSync = () => {
      timeouts = lyricsData.map((line, i) => {
        const delay = Math.max(0, line.time - audio.currentTime) * 1000;
        return setTimeout(() => {
          setActiveLyrics((prev) => [...prev, i]);
        }, delay);
      });
    };

    const stopSync = () => {
      timeouts.forEach(clearTimeout);
      setActiveLyrics([]);
    };

    audio.addEventListener('play', startSync);
    audio.addEventListener('pause', stopSync);
    audio.addEventListener('seeked', () => {
      stopSync();
      if (!audio.paused) startSync();
    });
    audio.addEventListener('ended', stopSync);

    return () => {
      stopSync();
      audio.removeEventListener('play', startSync);
      audio.removeEventListener('pause', stopSync);
      audio.removeEventListener('seeked', stopSync);
      audio.removeEventListener('ended', stopSync);
    };
  }, []);

  useEffect(() => {
    const lastIndex = activeLyrics.at(-1);
    const activeEl = lastIndex !== undefined ? linesRef.current[lastIndex] : null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLyrics]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-white bg-black text-center px-4 overflow-hidden">
      {/* Audio player */}
      <audio ref={audioRef} controls className="z-10 mb-6">
        <source src="/about-you.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* Lyrics */}
      <div className="overflow-y-auto max-h-[60vh] w-full px-4">
        <div className="flex flex-col gap-6 items-center py-6">
          {lyricsData.map((line: LyricLine, i: number) => {
            const isActive = activeLyrics.includes(i);
            const isFemaleLine = line.speaker === 'carly';

            return (
              <div
                key={i}
                ref={(el) => {
                  linesRef.current[i] = el;
                }}
                className={`transition-all duration-300 text-xl sm:text-2xl md:text-3xl font-medium max-w-2xl px-4 py-2 rounded-lg
                  ${isActive ? 'text-white bg-white/10 backdrop-blur-md' : 'text-white/10'}
                `}
              >
                {isActive && (
                  <AnimatedText
                    text={line.text}
                    delayPerChar={isFemaleLine ? 0.01 : 0.03}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      
    </div>

    
  );
}
