import '@fontsource-variable/manrope';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { InhaltProvider } from './inhalt/InhaltProvider.tsx';
import './index.css';

// Schriften liegen lokal (fontsource), nicht bei Google — wegen DSGVO.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InhaltProvider>
      {/* basename: auf GitHub Pages liegt die Seite in einem Unterordner */}
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <App />
      </BrowserRouter>
    </InhaltProvider>
  </StrictMode>,
);
