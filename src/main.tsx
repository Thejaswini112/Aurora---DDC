import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import { PoliciesProvider } from '@/contexts/PoliciesContext';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PoliciesProvider>
      <App />
    </PoliciesProvider>
  </StrictMode>
);