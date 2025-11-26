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
      {/* Header */}
      <div className="team-header">
        <Typography variant="h4" className="team-title">
          Equipo
        </Typography>
      </div>

      <Grid container spacing={3}>
        {/* Panel izquierdo - Lista de Proyectos */}
        <Grid item xs={12} md={4}>
          <Paper className="team-left-paper">
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

            <Typography variant="h6" className="team-subtitle">
              {tabValue === 0 ? 'Proyectos' : 'Proyectos'}
            </Typography>

            <div className="team-projects-column">
              {tabValue === 0 ? (
                // Proyectos como miembro
                proyectosUsuario.length > 0 ? (
                  proyectosUsuario.map((up) => (
                    <Card
                      key={up.id}
                      className={`team-project-card ${proyectoSeleccionado?.id === up.proyecto.id ? 'selected' : ''}`}
                      onClick={() => handleSeleccionarProyecto(up.proyecto.id)}
                    >
                      <CardContent className="team-card-content">
                        <div className="team-project-row">
                          <FolderIcon className="team-icon" />
                          <Typography variant="body1" className="team-project-name">
                            {up.proyecto.nombreProyecto}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Paper className="team-empty-paper">
                    <GroupIcon className="muted" sx={{ fontSize: 40, marginBottom: 8 }} />
                    <Typography variant="body2" className="muted">
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
                        className={`team-project-card ${proyectoSeleccionado?.id === proyecto.id ? 'selected' : ''}`}
                        onClick={() => handleSeleccionarProyecto(proyecto.id)}
                      >
                        <CardContent className="team-card-content">
                          <div className="team-project-row">
                            <AdminPanelSettingsIcon className="team-icon" />
                            <Typography variant="body1" className="team-project-name">
                              {proyecto.nombreProyecto}
                            </Typography>
                          </div>
                          <Typography variant="caption" className="muted">
                            Administrador
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
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
                  <Paper className="team-project-detail-card">
                    <div className="team-project-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  {tabValue === 0 ? (
                    <FolderIcon sx={{ fontSize: 40, color: '#312D2A' }} />
                  ) : (
                    <AdminPanelSettingsIcon sx={{ fontSize: 40, color: '#312D2A' }} />
                  )}
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {proyectoSeleccionado.nombreProyecto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {proyectoSeleccionado.id}
                    </Typography>
                  </Box>
                </div>

                <Divider sx={{ my: 2 }} />

                {/* Administrador */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Administrador del Proyecto
                  </Typography>
                  <Card className="team-admin-card">
                    <CardContent className="team-admin-content">
                      <Avatar 
                        className="team-admin-avatar"
                        sx={{ bgcolor: getAdminColor(proyectoSeleccionado.administrador.id) }}
                      >
                        {proyectoSeleccionado.administrador.nombreUsuario.charAt(0)}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Typography variant="h6" style={{ fontWeight: 700 }}>
                            {proyectoSeleccionado.administrador.nombreUsuario}
                          </Typography>
                          <Chip 
                            icon={<StarIcon />} 
                            label="Admin" 
                            size="small" 
                            sx={{ backgroundColor: '#312D2A', color: 'white', fontWeight: 'bold' }}
                          />
                          {proyectoSeleccionado.administrador.id === user.id && (
                            <Chip label="Tú" size="small" sx={{ backgroundColor: '#1976d2', color: 'white' }} />
                          )}
                        </div>
                        <Typography variant="body2" className="muted">
                          {proyectoSeleccionado.administrador.correo}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} className="team-stats-grid">
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {miembrosProyecto.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Miembros
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight="bold" color="primary">
                        {proyectoSeleccionado.sprints?.length || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sprints
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* Miembros del Equipo */}
              <Paper className="team-members-card">
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Miembros del Equipo
                </Typography>

                {loadingMiembros ? (
                  <Box className="team-centered" style={{ padding: 12 }}>
                    <CircularProgress />
                  </Box>
                ) : miembrosProyecto.length === 0 ? (
                  <Paper className="team-empty-paper">
                    <GroupIcon className="muted" sx={{ fontSize: 40, marginBottom: 8 }} />
                    <Typography variant="body2" className="muted">
                      No hay miembros en este proyecto
                    </Typography>
                  </Paper>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {miembrosProyecto.map((miembro) => (
                      <Card 
                        key={miembro.id}
                        className={`team-member-card ${isAdministrador(miembro.usuario.id) ? 'admin' : ''} ${miembro.usuario.id === user.id ? 'you' : ''}`}
                      >
                        <CardContent className="team-member-content">
                          <Avatar 
                            className="team-member-avatar"
                            sx={{ bgcolor: getAdminColor(miembro.usuario.id) }}
                          >
                            {miembro.usuario.nombreUsuario.charAt(0)}
                          </Avatar>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Typography variant="body1" style={{ fontWeight: 500 }}>
                                {miembro.usuario.nombreUsuario}
                                {miembro.usuario.id === user.id && (
                                  <span style={{ color: '#1976d2', marginLeft: 8 }}>(Tú)</span>
                                )}
                              </Typography>
                              {isAdministrador(miembro.usuario.id) && (
                                <Chip 
                                  icon={<StarIcon />} 
                                  label="Admin" 
                                  size="small" 
                                  sx={{ backgroundColor: '#312D2A', color: 'white', height: 20, fontSize: '0.7rem' }} 
                                />
                              )}
                            </div>
                            <Typography variant="body2" className="muted">
                              {miembro.usuario.correo}
                            </Typography>
                          </div>
                          <Chip 
                            label={`Rol ID: ${miembro.usuario.rol?.id ?? 'N/A'}`} 
                            size="small" 
                            variant="outlined"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </Paper>
            </Box>
          ) : (
            <Paper className="team-select-project">
              <Typography variant="body1" className="muted">
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