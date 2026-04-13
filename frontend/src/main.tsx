// ── ENTRY POINT of the React application ──
// This file initializes React and mounts the App component to the DOM

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

/**
 * Renders the React app into the DOM element with id='root'
 * Wraps App in React.StrictMode for development warnings
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)