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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Debes iniciar sesión</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Equipo
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Panel izquierdo - Lista de Proyectos */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            {/* Tabs para cambiar entre vistas */}
            {proyectosUsuario.length > 0 && proyectosAdmin.length > 0 && (
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                variant="fullWidth"
                sx={{ mb: 2 }}
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

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              {tabValue === 0 ? 'Proyectos' : 'Proyectos'}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {tabValue === 0 ? (
                // Proyectos como miembro
                proyectosUsuario.length > 0 ? (
                  proyectosUsuario.map((up) => (
                    <Card
                      key={up.id}
                      sx={{
                        cursor: 'pointer',
                        border: proyectoSeleccionado?.id === up.proyecto.id 
                          ? '2px solid #312D2A' 
                          : '1px solid #e0e0e0',
                        backgroundColor: proyectoSeleccionado?.id === up.proyecto.id 
                          ? '#f8f9fa' 
                          : 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleSeleccionarProyecto(up.proyecto.id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FolderIcon sx={{ color: '#312D2A' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {up.proyecto.nombreProyecto}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <GroupIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
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
                      sx={{
                        cursor: 'pointer',
                        border: proyectoSeleccionado?.id === proyecto.id 
                          ? '2px solid #312D2A' 
                          : '1px solid #e0e0e0',
                        backgroundColor: proyectoSeleccionado?.id === proyecto.id 
                          ? '#f8f9fa' 
                          : 'white',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleSeleccionarProyecto(proyecto.id)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AdminPanelSettingsIcon sx={{ color: '#312D2A' }} />
                          <Typography variant="body1" fontWeight="medium">
                            {proyecto.nombreProyecto}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
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
            </Box>
          </Paper>
        </Grid>

        {/* Panel derecho - Detalles del Proyecto y Miembros */}
        <Grid item xs={12} md={8}>
          {proyectoSeleccionado ? (
            <Box>
              {/* Card del Proyecto */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Administrador */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Administrador del Proyecto
                  </Typography>
                  <Card sx={{ 
                    backgroundColor: '#f8f9fa', 
                    border: '2px solid #312D2A'
                  }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 48, 
                          height: 48,
                          bgcolor: getAdminColor(proyectoSeleccionado.administrador.id)
                        }}
                      >
                        {proyectoSeleccionado.administrador.nombreUsuario.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {proyectoSeleccionado.administrador.nombreUsuario}
                          </Typography>
                          <Chip 
                            icon={<StarIcon />} 
                            label="Admin" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#312D2A', 
                              color: 'white',
                              fontWeight: 'bold'
                            }} 
                          />
                          {proyectoSeleccionado.administrador.id === user.id && (
                            <Chip 
                              label="Tú" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#1976d2', 
                                color: 'white'
                              }} 
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {proyectoSeleccionado.administrador.correo}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
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
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Miembros del Equipo
                </Typography>

                {loadingMiembros ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : miembrosProyecto.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                    <GroupIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No hay miembros en este proyecto
                    </Typography>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {miembrosProyecto.map((miembro) => (
                      <Card 
                        key={miembro.id}
                        sx={{ 
                          backgroundColor: isAdministrador(miembro.usuario.id) 
                            ? '#f8f9fa' 
                            : 'white',
                          border: isAdministrador(miembro.usuario.id) 
                            ? '1px solid #dee2e6' 
                            : '1px solid #e0e0e0',
                          boxShadow: miembro.usuario.id === user.id ? 3 : 1
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: getAdminColor(miembro.usuario.id)
                            }}
                          >
                            {miembro.usuario.nombreUsuario.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body1" fontWeight="medium">
                                {miembro.usuario.nombreUsuario}
                                {miembro.usuario.id === user.id && (
                                  <span style={{ color: '#1976d2', marginLeft: '8px' }}>
                                    (Tú)
                                  </span>
                                )}
                              </Typography>
                              {isAdministrador(miembro.usuario.id) && (
                                <Chip 
                                  icon={<StarIcon />} 
                                  label="Admin" 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: '#312D2A', 
                                    color: 'white',
                                    height: 20,
                                    fontSize: '0.7rem'
                                  }} 
                                />
                              )}
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {miembro.usuario.correo}
                            </Typography>
                          </Box>
                          <Chip 
                            label={`Rol ID: ${miembro.usuario.rol.id}`} 
                            size="small" 
                            variant="outlined"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Paper>
            </Box>
          ) : (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
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