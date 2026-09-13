import { useState, useEffect } from 'react';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

export function ScrambleText({ text, delay = 0, className = '' }: { text: string, delay?: number, className?: string }) {
  const [displayText, setDisplayText] = useState(text.replace(/./g, ' ')); // Start blank or scrambled

  useEffect(() => {
    let frame: number;
    let start = Date.now() + delay;
    const duration = 1200; // Scramble duration
    const length = text.length;

    const animate = () => {
      const now = Date.now();
      if (now < start) {
        frame = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(1, (now - start) / duration);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const solvedChars = Math.floor(easeProgress * length);

      let newText = '';
      for (let i = 0; i < length; i++) {
        if (i < solvedChars) {
          newText += text[i];
        } else {
          newText += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(newText);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [text, delay]);

  return <span className={className}>{displayText}</span>;
}
