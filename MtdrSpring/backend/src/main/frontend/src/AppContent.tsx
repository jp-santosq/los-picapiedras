import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedApp from "./ProtectedApp.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import Login from "./pages/Login.tsx";

// Componente principal de routing
function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<LandingPage />} />
        {/* Login */}
        <Route path="/login" element={<Login />} />
        {/* Rutas protegidas */}
        <Route path="/*" element={<ProtectedApp />} /> {/* <- aquí */}
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppContent;
