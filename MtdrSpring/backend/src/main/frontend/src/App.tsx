/*
-- Modificaciones -- 
Pedro Sanchez 3/9/2025
Ale Teran 2/10/2025
Christel Gomez 5/10/2025
David Martinez 15/10/2025
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
import SuperAdmin from "./components/SuperAdmin.tsx";


function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }
  console.log("Usuario autenticado:", user);
  console.log("ID de usuario:", user.id);

  if(user.rol===1){
    return <SuperAdmin/>
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
