import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/components/aboutPage.css";

const AboutPage = () => {
  const auth = useContext(AuthContext);

  if (!auth?.user) {
    return <div>No has iniciado sesión.</div>;
  }

  const getRolName = (rol: number) => {
    if (rol === 2) return "Administrador";
    if (rol === 3) return "Desarrollador";
  }
  return (
    <div className="about-container">
      <h2>Información del usuario</h2>
      <p>Nombre: {auth.user.name}</p>
      <p>Email: {auth.user.email}</p>
      <p>Rol: {getRolName(auth.user.rol)}</p>
      {/*<p>Modalidad: {auth.user.modalidad}</p>*/}
    </div>
  );
};

export default AboutPage;