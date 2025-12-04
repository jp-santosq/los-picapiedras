import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/fonts.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: '"Oracle Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    button: { textTransform: 'none' }
  }
});

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  );
}
