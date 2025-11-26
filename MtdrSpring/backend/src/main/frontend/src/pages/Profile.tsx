import { useEffect } from "react";
import "../styles/components/profile.css";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "../context/AuthContext";
import axios from "axios";


function Profile() {
  const { user } = useAuth();

  const getRoleLabel = (rol: any) => {
    if (typeof rol === 'number') {
      switch (rol) {
        case 1: return 'Super administrador';
        case 2: return 'Administrador';
        case 3: return 'Desarrollador';
        default: return 'Usuario';
      }
    }
    if (typeof rol === 'string') {
      const r = rol.toLowerCase();
      if (r.includes('super')) return 'Super administrador';
      if (r.includes('admin')) return 'Administrador';
      if (r.includes('desarrollador') || r.includes('dev')) return 'Desarrollador';
      return rol;
    }
    return 'Usuario';
  };

  const getRolColor = (rol: any) => {
    if (typeof rol === 'string') {
      const r = rol.toLowerCase();
      if (r.includes('super')) return '#6f42c1';
      if (r.includes('admin')) return '#23627c';
      if (r.includes('desarrollador') || r.includes('dev')) return '#09cdcd';
      return '#333';
    }
    return '#333';
  };

  const getProyectName = async() =>{
    const response = await axios.get("/proyecto/all")

    const data = response.data
    console.log(typeof data)
    if (typeof data == "object"){
      console.log(data)
    }else{
      {/*quien fue el naco que escribio recivio*/}
      throw new Error("No se recivio lo esperado")
    }
  }

  useEffect(()=>{
    getProyectName()
  },[])

  return (
  <>
    <div className="container">
      <header className="page-header">
        <h1>Mi Perfil</h1>
        <p className="page-subtitle">
          Información de tu cuenta
        </p>
      </header>

      <div className="profile-card">
        <div className="profile-top">
          <div className="avatar-wrapper">
            <Avatar
              className="avatar"
              src={user?.image || undefined}
              alt={user?.name}
              sx={{
                bgcolor: user?.image ? "transparent" : getRolColor(user?.rol),
                color: user?.image ? undefined : "#fff",
              }}
            >
              {!user?.image && user?.name?.[0]?.toUpperCase()}
            </Avatar>

            <span
              className="role-badge"
              style={{ backgroundColor: getRolColor(user?.rol) }}
            >
              {getRoleLabel(user?.rol)}
            </span>
          </div>

          <div className="profile-main-info">
            <h2>{user?.name || "Usuario sin nombre"}</h2>
          </div>
        </div>

        <hr className="separator separator-soft" />

        <section className="profile-details">
          <h3>Detalles personales</h3>
          <div className="info-grid">
            <span className="info-label">Nombre</span>
            <span className="info-value">{user?.name}</span>

            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>

            <span className="info-label">Rol</span>
            <span className="info-value">
              {getRoleLabel(user?.rol)}
              {typeof user?.rol === "number" && (
                <span className="info-tag">({user?.rol})</span>
              )}
            </span>

            <span className="info-label">ID</span>
            <span className="info-value">{user?.id}</span>
          </div>
        </section>
      </div>

      <section className="projects-section">
        <h3>Proyectos</h3>
        <p className="projects-empty">
          Proyectos asignados
        </p>
      </section>
    </div>
  </>
);

}

export default Profile;
