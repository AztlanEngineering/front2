// [REF 17.1]
// src/entry-client.tsx
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// This is where the React app is hydrated
hydrateRoot(document.getElementById('app')!, <App />);

