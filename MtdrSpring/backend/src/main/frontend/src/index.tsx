import React from 'react';
import ReactDOM from 'react-dom';
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
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>,
    rootElement
  );
}
