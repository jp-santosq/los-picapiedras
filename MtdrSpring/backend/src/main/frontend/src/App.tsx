/*
-- Modificaciones -- 
Pedro Sanchez 3/9/2025
Ale Teran 2/10/2025
Christel Gomez 5/10/2025
*/

import { AuthProvider } from "./context/AuthContext.tsx";
import { SprintsProvider } from "./context/SprintContext.tsx";
import Login from "./pages/Login.tsx";
import NavBar from "./components/NavBar.tsx";
import "./styles/index.css";
import "./styles/fonts.css";
import { useAuth } from "./context/AuthContext.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TasksProvider } from "./context/TaskContext.tsx";

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
    <TasksProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SprintsProvider>
            <AppContent />
          </SprintsProvider>
        </AuthProvider>
      </ThemeProvider>
    </TasksProvider>
  );
}

export default App;
