import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, RotateCcw } from 'lucide-react';

interface LyricLine {
  text: string;
  typingSpeed: number;
  delay: number;
}

const LyricAnimation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLyrics, setCurrentLyrics] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const lyrics: LyricLine[] = [
    { text: "Do you think I have forgotten?", typingSpeed: 100, delay: 300 },
    { text: "Do you think I have forgotten?", typingSpeed: 100, delay: 5000 },
    { text: "Do you think I have forgotten", typingSpeed: 100, delay: 10000 },
    { text: "about you?", typingSpeed: 200, delay: 15000 },
    { text: "There was something bout you that now I cant remember", typingSpeed: 80, delay: 20300 },
    { text: "Its the same damn thing that made my heart surrender", typingSpeed: 80, delay: 25000 },
    { text: "And I miss you on a train, I miss you in the morning, I", typingSpeed: 98, delay: 30000 },
    { text: "never know what to think about", typingSpeed: 95, delay: 36200 },
    { text: "I think about youuuuuuuuuuuuuu", typingSpeed: 100, delay: 39300 }
  ];

  const animateTyping = (text: string, speed: number, lineIndex: number) => {
    let currentText = '';
    let charIndex = 0;

    const typeChar = () => {
      if (charIndex < text.length) {
        currentText += text[charIndex];
        setCurrentLyrics(prev => {
          const newLyrics = [...prev];
          newLyrics[lineIndex] = currentText;
          return newLyrics;
        });
        charIndex++;

        const timeout = setTimeout(typeChar, speed);
        timeoutsRef.current.push(timeout);
      }
    };

    typeChar();
  };

  const startAnimation = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsPlaying(true);
    setCurrentLyrics([]);
    setAudioError(null);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioError('Could not play audio. Please make sure about-you.mp3 is in the public folder.');
      });
    }

    lyrics.forEach((lyric, index) => {
      const timeout = setTimeout(() => {
        setCurrentLyrics(prev => [...prev, '']);
        animateTyping(lyric.text, lyric.typingSpeed, index);
      }, lyric.delay);

      timeoutsRef.current.push(timeout);
    });

    const totalDuration = Math.max(...lyrics.map(l => l.delay)) + 10000;
    const finalTimeout = setTimeout(() => {
      setIsPlaying(false);
      setIsAnimating(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }, totalDuration);

    timeoutsRef.current.push(finalTimeout);
  };

  const stopAnimation = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsAnimating(false);
  };

  const resetAnimation = () => {
    stopAnimation();
    setCurrentLyrics([]);
    setAudioError(null);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        onError={() => setAudioError('Could not load audio file. Please make sure about-you.mp3 is in the public folder.')}
      >
        <source src="/about-you.mp3" type="audio/mpeg" />
        <source src="/about-you.wav" type="audio/wav" />
        Ups! browser kamu ga mendukung audio berjalan, nih.
      </audio>

      <div className="max-w-4xl w-full text-center z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Music className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bolder text-white">About You - The 1945</h1>
          </div>
          <p className="text-gray-300 text-lg">Lyrics:</p>
        </div>

        {/* Audio Error */}
        {audioError && (
          <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-6 text-red-200">
            <p className="font-medium">Audio Error:</p>
            <p className="text-sm">{audioError}</p>
          </div>
        )}

        {/* Lyrics Display */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8 min-h-96 flex flex-col justify-center">
          <div className="space-y-6">
            {currentLyrics.map((lyric, index) => (
              <div
                key={index}
                className={`text-white text-xl md:text-2xl font-medium transition-all duration-500 ${
                  lyric ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}

                style={{
                  textShadow: 'px 2px 4px #00ffb3, 0.80), 0 0 10px rgba(255, 255, 255, 0.3)'
                }}
              >
                {lyric}
                {lyric && lyric === currentLyrics[currentLyrics.length - 1] && (
                  <span className="inline-block w-0.5 h-6 bg-white ml-1 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {!isAnimating && currentLyrics.length === 0 && (
            <div className="text-gray-400 text-lg">
              Tekan Mulai untuk memulai lirik lagu
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={isPlaying ? stopAnimation : startAnimation}
            disabled={false}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                Berhenti
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Mulai
              </>
            )}
          </button>

          <button
            onClick={resetAnimation}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            Ulang
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">"ditantang Nesya, diterima oleh Jefanniel"</p>
        </div>
      </div>
    </div>
  );
};

export default LyricAnimation;
