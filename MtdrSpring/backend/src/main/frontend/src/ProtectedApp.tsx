// ProtectedApp.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.tsx";
import NavBar from "./components/NavBar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Sprints from "./pages/Sprints.tsx";
import Tasks from "./pages/Tasks.tsx";
import KPIs from "./pages/KPIs.tsx";
import About from "./pages/AboutPage.tsx";
import Team from "./pages/Team.tsx";
import SprintGenerator from "./pages/SprintGenerator.tsx";
import RagUpload from "./pages/RagUpload.tsx";
import Profile from "./pages/Profile.tsx";
import SuperAdmin from "./components/SuperAdmin.tsx";
import Login from "./pages/Login.tsx";
import { ROL } from "./components/enums.tsx";

// Componente que maneja la lógica de autenticación y rutas protegidas
function ProtectedApp() {
  const { user } = useAuth();

  // Si no hay usuario en el contexto (ni en localStorage), mostramos login
  if (!user) {
    return <Login />;
  }

  console.log("Usuario desde localStorage:", user);
  console.log("ID de usuario:", user.id);

  if (user.rol === ROL.SUPERADMIN) {
    return <SuperAdmin />;
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="app" element={<Dashboard />} />
        <Route path="sprints" element={<Sprints />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="kpis" element={<KPIs />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="sprint" element={<SprintGenerator />} />
        <Route path="knowledge" element={<RagUpload />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default ProtectedApp;
