/*
Ultima modificacion Pedro Sanchez
3/9/2025
*/

import { AuthProvider } from "./context/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import NavBar from "./components/NavBar.tsx";
import "./styles/index.css";
import { useAuth } from "./context/AuthContext.tsx";

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
