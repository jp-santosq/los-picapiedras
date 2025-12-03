import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import axios from "axios";
import "../styles/components/team.css";

type Usuario = {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: {
    id: number;
  };
};

type ProyectoInfo = {
  id: number;
  nombreProyecto: string;
};

type UsuarioInfo = {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: {
    id: number;
  };
};

type UsuarioProyecto = {
  id: number;
  usuario: UsuarioInfo;
  proyecto: ProyectoInfo;
};

type ProyectoDetalle = {
  id: number;
  nombreProyecto: string;
  administrador: Usuario;
  sprints: any[];
};

type MiembroProyecto = {
  id: number;
  usuario: Usuario;
  proyecto: ProyectoInfo;
};

function Team() {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // Para proyectos como miembro
  const [proyectosUsuario, setProyectosUsuario] = useState<UsuarioProyecto[]>([]);
  
  // Para proyectos como administrador
  const [proyectosAdmin, setProyectosAdmin] = useState<ProyectoDetalle[]>([]);
  
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<ProyectoDetalle | null>(null);
  const [miembrosProyecto, setMiembrosProyecto] = useState<MiembroProyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMiembros, setLoadingMiembros] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProyectos();
    }
  }, [user]);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      
      // Obtener proyectos como miembro
      const responseMiembro = await axios.get(`/usuarioProyecto/usuario/${user?.id}`);
      setProyectosUsuario(responseMiembro.data);
      
      // Obtener proyectos como administrador
      const responseAdmin = await axios.get(`/proyecto/administrador/${user?.id}`);
      setProyectosAdmin(responseAdmin.data || []);
      
      // Seleccionar el primer proyecto disponible
      if (responseAdmin.data && responseAdmin.data.length > 0) {
        setTabValue(1); // Tab de administrador
        await fetchDetalleProyecto(responseAdmin.data[0].id);
      } else if (responseMiembro.data.length > 0) {
        setTabValue(0); // Tab de miembro
        await fetchDetalleProyecto(responseMiembro.data[0].proyecto.id);
      }
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetalleProyecto = async (proyectoId: number) => {
    try {
      setLoadingMiembros(true);
      
      // Obtener detalles del proyecto
      const proyectoResponse = await axios.get(`/proyecto/all`);
      const proyecto = proyectoResponse.data.find((p: ProyectoDetalle) => p.id === proyectoId);
      setProyectoSeleccionado(proyecto);

      // Obtener miembros del proyecto
      const miembrosResponse = await axios.get(`/usuarioProyecto/proyecto/${proyectoId}`);
      setMiembrosProyecto(miembrosResponse.data);
    } catch (error) {
      console.error("Error al cargar detalle del proyecto:", error);
    } finally {
      setLoadingMiembros(false);
    }
  };

  const handleSeleccionarProyecto = (proyectoId: number) => {
    fetchDetalleProyecto(proyectoId);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setProyectoSeleccionado(null);
    setMiembrosProyecto([]);
    
    // Seleccionar automáticamente el primer proyecto de la nueva tab
    if (newValue === 0 && proyectosUsuario.length > 0) {
      fetchDetalleProyecto(proyectosUsuario[0].proyecto.id);
    } else if (newValue === 1 && proyectosAdmin.length > 0) {
      fetchDetalleProyecto(proyectosAdmin[0].id);
    }
  };

  const getAdminColor = (adminId: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1'];
    return colors[adminId % colors.length];
  };

  const isAdministrador = (usuarioId: number) => {
    return proyectoSeleccionado?.administrador.id === usuarioId;
  };

  if (!user) {
    return (
      <Box className="team-centered">
        <Typography variant="h5">Debes iniciar sesión</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="team-centered">
        <CircularProgress />
      </Box>
    );
  }

  const proyectosActuales = tabValue === 0 ? proyectosUsuario : proyectosAdmin;
  const sinProyectos = proyectosUsuario.length === 0 && proyectosAdmin.length === 0;

  if (sinProyectos) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 500 }}>
          <GroupIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No tienes proyectos asignados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No estás en ningún proyecto ni administras ninguno
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="team-page">
      {/* Hero Section */}
      <section className="page-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Colaboración</p>
          <h1 className="page-title">Gestión de Equipo</h1>
          <p className="page-subtitle">
            Administra y visualiza los miembros de tus proyectos
          </p>
        </div>
        <div className="hero-actions">
          <Chip 
            icon={<GroupIcon />}
            label={`${miembrosProyecto.length} Miembro${miembrosProyecto.length !== 1 ? 's' : ''}`}
            className="hero-chip"
          />
        </div>
      </section>

      <Grid container spacing={3}>
        {/* Panel izquierdo - Lista de Proyectos */}
        <Grid item xs={12} md={4}>
          <Paper className="content-card team-left-panel">
            {/* Tabs para cambiar entre vistas */}
              {proyectosUsuario.length > 0 && proyectosAdmin.length > 0 && (
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                className="team-tabs"
              >
                <Tab 
                  label="Como Miembro" 
                  icon={<GroupIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Como Admin" 
                  icon={<AdminPanelSettingsIcon />} 
                  iconPosition="start"
                />
              </Tabs>
            )}

            <Typography variant="h6" className="section-title">
              {tabValue === 0 ? 'Mis Proyectos' : 'Proyectos que Administro'}
            </Typography>

            <div className="team-projects-list">{tabValue === 0 ? (
                // Proyectos como miembro
                proyectosUsuario.length > 0 ? (
                  proyectosUsuario.map((up) => (
                    <Card
                      key={up.id}
                      className={`project-card ${proyectoSeleccionado?.id === up.proyecto.id ? 'selected' : ''}`}
                      onClick={() => handleSeleccionarProyecto(up.proyecto.id)}
                    >
                      <CardContent className="project-card-content">
                        <div className="project-card-row">
                          <FolderIcon className="project-icon" />
                          <Typography variant="body1" className="project-name">
                            {up.proyecto.nombreProyecto}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Paper className="empty-state">
                    <GroupIcon sx={{ fontSize: 40, marginBottom: 1, color: '#7b8197' }} />
                    <Typography variant="body2" className="empty-text">
                      No eres miembro de ningún proyecto
                    </Typography>
                  </Paper>
                )
              ) : (
                // Proyectos como administrador
                proyectosAdmin.length > 0 ? (
                  proyectosAdmin.map((proyecto) => (
                      <Card
                        key={proyecto.id}
                        className={`project-card ${proyectoSeleccionado?.id === proyecto.id ? 'selected' : ''}`}
                        onClick={() => handleSeleccionarProyecto(proyecto.id)}
                      >
                        <CardContent className="project-card-content">
                          <div className="project-card-row">
                            <AdminPanelSettingsIcon className="project-icon" />
                            <Typography variant="body1" className="project-name">
                              {proyecto.nombreProyecto}
                            </Typography>
                          </div>
                          <Typography variant="caption" className="project-role">
                            Administrador
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <Paper className="empty-state">
                    <AdminPanelSettingsIcon sx={{ fontSize: 40, marginBottom: 1, color: '#7b8197' }} />
                    <Typography variant="body2" className="empty-text">
                      No administras ningún proyecto
                    </Typography>
                  </Paper>
                )
              )}
            </div>
          </Paper>
        </Grid>

        {/* Panel derecho - Detalles del Proyecto y Miembros */}
        <Grid item xs={12} md={8}>
          {proyectoSeleccionado ? (
            <Box>
              {/* Card del Proyecto */}
                  <Paper className="content-card project-detail-card">
                    <div className="project-header">
                  {tabValue === 0 ? (
                    <FolderIcon sx={{ fontSize: 40, color: '#1565c0' }} />
                  ) : (
                    <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#1565c0' }} />
                  )}
                  <Box>
                    <Typography variant="h5" className="project-title">
                      {proyectoSeleccionado.nombreProyecto}
                    </Typography>
                    <Typography variant="body2" className="project-id">
                      ID: {proyectoSeleccionado.id}
                    </Typography>
                  </Box>
                </div>

                <Divider sx={{ my: 2 }} />

                {/* Administrador */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" className="section-label">
                    Administrador del Proyecto
                  </Typography>
                  <Card className="admin-card">
                    <CardContent className="admin-card-content">
                      <Avatar 
                        className="admin-avatar"
                        sx={{ bgcolor: getAdminColor(proyectoSeleccionado.administrador.id) }}
                      >
                        {proyectoSeleccionado.administrador.nombreUsuario.charAt(0)}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div className="admin-info-row">
                          <Typography variant="h6" className="admin-name">
                            {proyectoSeleccionado.administrador.nombreUsuario}
                          </Typography>
                          <Chip 
                            icon={<StarIcon />} 
                            label="Admin" 
                            size="small" 
                            className="chip-admin"
                          />
                          {proyectoSeleccionado.administrador.id === user.id && (
                            <Chip label="Tú" size="small" className="chip-you" />
                          )}
                        </div>
                        <Typography variant="body2" className="admin-email">
                          {proyectoSeleccionado.administrador.correo}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} className="stats-grid">
                  <Grid item xs={6}>
                    <Paper className="stat-box">
                      <Typography variant="h4" className="stat-value">
                        {miembrosProyecto.length}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Miembros
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper className="stat-box">
                      <Typography variant="h4" className="stat-value">
                        {proyectoSeleccionado.sprints?.length || 0}
                      </Typography>
                      <Typography variant="body2" className="stat-label">
                        Sprints
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Miembros del Equipo */}
              <Paper className="content-card members-card">
                <Typography variant="h6" className="section-title">
                  Miembros del Equipo
                </Typography>

                {loadingMiembros ? (
                  <Box className="team-centered" style={{ padding: 12 }}>
                    <CircularProgress />
                  </Box>
                ) : miembrosProyecto.length === 0 ? (
                  <Paper className="empty-state">
                    <GroupIcon sx={{ fontSize: 40, marginBottom: 1, color: '#7b8197' }} />
                    <Typography variant="body2" className="empty-text">
                      No hay miembros en este proyecto
                    </Typography>
                  </Paper>
                ) : (
                  <div className="members-list">
                    {miembrosProyecto.map((miembro) => (
                      <Card 
                        key={miembro.id}
                        className={`member-card ${isAdministrador(miembro.usuario.id) ? 'admin' : ''} ${miembro.usuario.id === user.id ? 'you' : ''}`}
                      >
                        <CardContent className="member-card-content">
                          <Avatar 
                            className="member-avatar"
                            sx={{ bgcolor: getAdminColor(miembro.usuario.id) }}
                          >
                            {miembro.usuario.nombreUsuario.charAt(0)}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <div className="member-info-row">
                              <Typography variant="body1" className="member-name">
                                {miembro.usuario.nombreUsuario}
                                {miembro.usuario.id === user.id && (
                                  <span className="member-you-label">(Tú)</span>
                                )}
                              </Typography>
                              {isAdministrador(miembro.usuario.id) && (
                                <Chip 
                                  icon={<StarIcon />} 
                                  label="Admin" 
                                  size="small" 
                                  className="chip-admin-small"
                                />
                              )}
                            </div>
                            <Typography variant="body2" className="member-email">
                              {miembro.usuario.correo}
                            </Typography>
                          </div>
                          <Chip 
                            label={`Rol ID: ${miembro.usuario.rol?.id ?? 'N/A'}`} 
                            size="small" 
                            variant="outlined"
                            className="chip-role"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </Paper>
            </Box>
          ) : (
            <Paper className="content-card empty-selection">
              <Typography variant="body1" className="empty-text">
                Selecciona un proyecto para ver los detalles del equipo
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Team;