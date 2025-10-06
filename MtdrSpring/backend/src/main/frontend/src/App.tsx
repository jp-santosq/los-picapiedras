/*
-- Modificaciones -- 
Pedro Sanchez 3/9/2025
Ale Teran 2/10/2025
Christel Gomez 5/10/2025
*/

import { AuthProvider } from "./context/AuthContext.tsx";
import { TasksProvider } from "./context/TaskContext.tsx";
import { SprintsProvider } from './context/SprintContext';
import Login from "./pages/Login.tsx";
import NavBar from "./components/NavBar.tsx";
import "./styles/index.css";
import "./styles/fonts.css";
import { useAuth } from "./context/AuthContext.tsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <NavBar />
    </>
  );
}

const theme = createTheme({
  typography: {
    fontFamily: '"Oracle Sans", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <TasksProvider>    
          <SprintsProvider> 
            <AppContent />
          </SprintsProvider>
        </TasksProvider> 
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;