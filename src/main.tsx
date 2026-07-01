import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import App from './App';

// code to fix Leaflet default marker icons not loading in Vite below (ai assisted in this debugging, but was reviewed and understood by me):
// BASE_URL keeps these public assets resolving correctly under the GitHub Pages /tailblazer/ base path.
const base = import.meta.env.BASE_URL;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `${base}marker-icon-2x.png`,
  iconUrl: `${base}marker-icon.png`,
  shadowUrl: `${base}marker-shadow.png`,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
