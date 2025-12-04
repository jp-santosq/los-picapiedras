/*
-- Modificaciones -- 
Pedro Sanchez 3/9/2025
Ale Teran 2/10/2025
Christel Gomez 5/10/2025
David Martinez 15/10/2025
*/

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { SprintsProvider } from "./context/SprintContext.tsx";
import { ProjectProvider } from "./context/ProjectContext.tsx";
import Login from "./pages/Login.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Sprints from "./pages/Sprints.tsx";
import Tasks from "./pages/Tasks.tsx";
import KPIs from "./pages/KPIs.tsx";
import About from "./pages/AboutPage.tsx";
import Team from "./pages/Team.tsx";
import SprintGenerator from './pages/SprintGenerator.tsx';
import RagUpload from './pages/RagUpload.tsx';
import Profile from "./pages/Profile.tsx";
import NavBar from "./components/NavBar.tsx";
import "./styles/index.css";
import "./styles/fonts.css";
import { useAuth } from "./context/AuthContext.tsx";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TasksProvider } from "./context/TaskContext.tsx";
import SuperAdmin from "./components/SuperAdmin.tsx";
import {ROL} from "./components/enums.tsx"


// Componente que maneja la lógica de autenticación y rutas protegidas
function ProtectedApp() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }
  console.log("Usuario autenticado:", user);
  console.log("ID de usuario:", user.id);

  if(user.rol===ROL.SUPERADMIN){
    return <SuperAdmin/>
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sprints" element={<Sprints />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/kpis" element={<KPIs />} />
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />
        <Route path="/sprintgenerator" element={<SprintGenerator />} />
        <Route path="/knowledge" element={<RagUpload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </>
  );
}

// Componente principal de routing
function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal - Stone Flow Landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login independiente */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas de la aplicación protegida */}
        <Route path="/app/*" element={<ProtectedApp />} />
        
        {/* Redirección por defecto a la landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
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
