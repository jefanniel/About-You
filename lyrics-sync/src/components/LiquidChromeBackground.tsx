// src/components/LiquidChromeBackground.tsx
import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import LiquidChrome from './UI/LiquidChrome';

const LiquidChromeBackground = () => {
  useEffect(() => {
    const container = document.getElementById('liquid-bg-root');
    if (!container) return;
    const root = createRoot(container);

    root.render(
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        overflow: 'hidden',
      }}>
        <LiquidChrome
          baseColor={[0.0, 0.01, 0.0]}
          speed={0.02}
          amplitude={0.3}
          interactive={!true}
        />
      </div>
    );
  }, []);

  return null;
};

export default LiquidChromeBackground;
