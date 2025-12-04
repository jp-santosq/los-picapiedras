// App.tsx
/*
-- Modificaciones -- 
Pedro Sanchez 3/9/2025
Ale Teran 2/10/2025
Christel Gomez 5/10/2025
David Martinez 15/10/2025
*/

import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { SprintsProvider } from "./context/SprintContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import { TasksProvider } from "./context/TaskContext.tsx";
import AppContent from "./AppContent.tsx";
import "./styles/index.css";
import "./styles/fonts.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: '"Oracle Sans", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <ProjectProvider>
          <AuthProvider>
            <TasksProvider>
              <SprintsProvider>
                <AppContent />
              </SprintsProvider>
            </TasksProvider>
          </AuthProvider>
        </ProjectProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;