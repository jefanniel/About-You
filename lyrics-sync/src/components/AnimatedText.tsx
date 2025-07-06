import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Props = {
  text: string;
  delayPerChar?: number;
};

export default function AnimatedText({ text, delayPerChar = 0.03 }: Props) {
  const [displayedText, setDisplayedText] = useState<string[]>([]);

  useEffect(() => {
    setDisplayedText(text.split(''));
  }, [text]);

  return (
    <div className="inline-block">
      {displayedText.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '0.3em' }}
          animate={{ opacity: 1, y: '0em' }}
          transition={{ delay: i * delayPerChar, duration: 0.3 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </div>
  );
}
