import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Paper,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from "axios";

type Usuario = {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: {
    id: number;
  };
};

type Sprint = {
  id: number;
  nombreSprint: string;
  fechaInicio: string;
  fechaFin: string;
};

type Proyecto = {
  id: number;
  nombreProyecto: string;
  administrador: Usuario;
  sprints: Sprint[];
};

type UsuarioProyecto = {
  id: number;
  usuario: Usuario;
  proyecto: Proyecto;
};

function SuperAdmin() {
  const { user } = useAuth();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [administradores, setAdministradores] = useState<Usuario[]>([]);
  const [desarrolladores, setDesarrolladores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null);
  const [miembrosProyecto, setMiembrosProyecto] = useState<UsuarioProyecto[]>([]);
  const [loadingMiembros, setLoadingMiembros] = useState(false);
  const [selectedDesarrollador, setSelectedDesarrollador] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombreProyecto: "",
    administradorId: ""
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProyectos();
    fetchAdministradores();
    fetchDesarrolladores();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/proyecto/all");
      setProyectos(response.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdministradores = async () => {
    try {
      const response = await axios.get("/usuario/rol/1");
      setAdministradores(response.data);
    } catch (error) {
      console.error("Error al cargar administradores:", error);
    }
  };

  const fetchDesarrolladores = async () => {
    try {
      // Obtener usuarios con rol ID 3 (desarrolladores)
      const response = await axios.get("/usuario/rol/22");
      setDesarrolladores(response.data);
    } catch (error) {
      console.error("Error al cargar desarrolladores:", error);
    }
  };

  const fetchMiembrosProyecto = async (proyectoId: number) => {
    try {
      setLoadingMiembros(true);
      const response = await axios.get(`/usuarioProyecto/proyecto/${proyectoId}`);
      console.log("Miembros recibidos:", response.data);
      setMiembrosProyecto(response.data);
    } catch (error) {
      console.error("Error al cargar miembros:", error);
      setMiembrosProyecto([]);
    } finally {
      setLoadingMiembros(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError("");
    setNuevoProyecto({ nombreProyecto: "", administradorId: "" });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError("");
  };

  const handleOpenDetailDialog = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setOpenDetailDialog(true);
    fetchMiembrosProyecto(proyecto.id);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedProyecto(null);
    setMiembrosProyecto([]);
    setSuccessMessage("");
  };

  const handleOpenAddMemberDialog = () => {
    setOpenAddMemberDialog(true);
    setSelectedDesarrollador("");
    setError("");
  };

  const handleCloseAddMemberDialog = () => {
    setOpenAddMemberDialog(false);
    setSelectedDesarrollador("");
    setError("");
  };

  const handleAddMember = async () => {
    if (!selectedDesarrollador || !selectedProyecto) {
      setError("Debes seleccionar un desarrollador");
      return;
    }

    try {
      await axios.post("/usuarioProyecto/add", {
        idUsuario: parseInt(selectedDesarrollador),
        idProyecto: selectedProyecto.id
      });

      setSuccessMessage("Desarrollador agregado exitosamente");
      handleCloseAddMemberDialog();
      fetchMiembrosProyecto(selectedProyecto.id);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al agregar miembro:", error);
      setError("Error al agregar el desarrollador al proyecto");
    }
  };

  const handleCreateProyecto = async () => {
    if (!nuevoProyecto.nombreProyecto.trim() || !nuevoProyecto.administradorId) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      await axios.post("/proyecto/add", {
        nombreProyecto: nuevoProyecto.nombreProyecto,
        administradorId: parseInt(nuevoProyecto.administradorId)
      });
      
      handleCloseDialog();
      fetchProyectos();
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      setError("Error al crear el proyecto. Verifica que el administrador sea válido.");
    }
  };

  const getAdminColor = (adminId: number) => {
    const colors = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#0288d1'];
    return colors[adminId % colors.length];
  };

  const isAdministrador = (usuarioId: number) => {
    return selectedProyecto?.administrador.id === usuarioId;
  };

  const getDesarrolladoresDisponibles = () => {
    // Filtrar desarrolladores que no estén ya en el proyecto
    const idsEnProyecto = miembrosProyecto.map(mp => mp.usuario.id);
    return desarrolladores.filter(dev => !idsEnProyecto.includes(dev.id));
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Debes iniciar sesión</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Panel de Proyectos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ 
            backgroundColor: '#312D2A',
            '&:hover': { backgroundColor: '#242220' }
          }}
        >
          Nuevo Proyecto
        </Button>
      </Box>

      {/* Lista de Proyectos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <Typography>Cargando proyectos...</Typography>
        </Box>
      ) : proyectos.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FolderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No hay proyectos registrados
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {proyectos.map((proyecto) => (
            <Grid item xs={12} md={6} lg={4} key={proyecto.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                onClick={() => handleOpenDetailDialog(proyecto)}
              >
                <CardContent>
                  {/* Nombre del Proyecto */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FolderIcon sx={{ color: getAdminColor(proyecto.administrador?.id || 0) }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {proyecto.nombreProyecto}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Administrador */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: getAdminColor(proyecto.administrador?.id || 0)
                      }}
                    >
                      {proyecto.administrador?.nombreUsuario?.charAt(0) || '?'}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {proyecto.administrador?.nombreUsuario || 'Sin asignar'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {proyecto.administrador?.correo || ''}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Info Sprints */}
                  <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sprints: <strong>{proyecto.sprints?.length || 0}</strong>
                    </Typography>
                  </Box>

                  {/* ID */}
                  <Typography variant="caption" color="text.secondary">
                    ID: {proyecto.id}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog Crear Proyecto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Nombre del Proyecto"
            value={nuevoProyecto.nombreProyecto}
            onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombreProyecto: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Administrador del Proyecto</InputLabel>
            <Select
              value={nuevoProyecto.administradorId}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, administradorId: e.target.value })}
              label="Administrador del Proyecto"
            >
              {administradores.map((admin) => (
                <MenuItem key={admin.id} value={admin.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        fontSize: '0.875rem',
                        bgcolor: getAdminColor(admin.id)
                      }}
                    >
                      {admin.nombreUsuario.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">{admin.nombreUsuario}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {admin.correo}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateProyecto}
            sx={{ 
              backgroundColor: '#312D2A',
              '&:hover': { backgroundColor: '#242220' }
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Detalle del Proyecto con Miembros */}
      <Dialog 
        open={openDetailDialog} 
        onClose={handleCloseDetailDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderIcon sx={{ color: getAdminColor(selectedProyecto?.administrador?.id || 0) }} />
            <Typography variant="h6" fontWeight="bold">
              {selectedProyecto?.nombreProyecto}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetailDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Mensaje de éxito */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Administrador destacado */}
          <Box sx={{ mb: 3 }}>
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
                    bgcolor: getAdminColor(selectedProyecto?.administrador?.id || 0)
                  }}
                >
                  {selectedProyecto?.administrador?.nombreUsuario?.charAt(0) || '?'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedProyecto?.administrador?.nombreUsuario}
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
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {selectedProyecto?.administrador?.correo}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Miembros del Proyecto */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Miembros del Proyecto ({miembrosProyecto.length})
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={handleOpenAddMemberDialog}
                sx={{
                  borderColor: '#312D2A',
                  color: '#312D2A',
                  '&:hover': {
                    borderColor: '#242220',
                    backgroundColor: 'rgba(49, 45, 42, 0.04)'
                  }
                }}
              >
                Agregar Miembro
              </Button>
            </Box>
            
            {loadingMiembros ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Typography>Cargando miembros...</Typography>
              </Box>
            ) : miembrosProyecto.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary">
                  No hay miembros asignados a este proyecto
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {miembrosProyecto.map((usuarioProyecto) => (
                  <Card 
                    key={usuarioProyecto.id}
                    sx={{ 
                      backgroundColor: isAdministrador(usuarioProyecto.usuario.id) 
                        ? '#f8f9fa' 
                        : 'white',
                      border: isAdministrador(usuarioProyecto.usuario.id) 
                        ? '1px solid #dee2e6' 
                        : '1px solid #e0e0e0'
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          bgcolor: getAdminColor(usuarioProyecto.usuario.id)
                        }}
                      >
                        {usuarioProyecto.usuario.nombreUsuario.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {usuarioProyecto.usuario.nombreUsuario}
                          </Typography>
                          {isAdministrador(usuarioProyecto.usuario.id) && (
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
                          {usuarioProyecto.usuario.correo}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`Rol ID: ${usuarioProyecto.usuario.rol.id}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Box>

          {/* Información adicional del proyecto */}
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="caption" color="text.secondary">
                    Sprints
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedProyecto?.sprints?.length || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                  <Typography variant="caption" color="text.secondary">
                    ID del Proyecto
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedProyecto?.id}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Agregar Miembro */}
      <Dialog open={openAddMemberDialog} onClose={handleCloseAddMemberDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Desarrollador al Proyecto</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
            Proyecto: <strong>{selectedProyecto?.nombreProyecto}</strong>
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Seleccionar Desarrollador</InputLabel>
            <Select
              value={selectedDesarrollador}
              onChange={(e) => setSelectedDesarrollador(e.target.value)}
              label="Seleccionar Desarrollador"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {getDesarrolladoresDisponibles().length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    No hay desarrolladores disponibles
                  </Typography>
                </MenuItem>
              ) : (
                getDesarrolladoresDisponibles().map((dev) => (
                  <MenuItem key={dev.id} value={dev.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          fontSize: '0.875rem',
                          bgcolor: getAdminColor(dev.id)
                        }}
                      >
                        {dev.nombreUsuario.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">{dev.nombreUsuario}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dev.correo}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddMemberDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            onClick={handleAddMember}
            disabled={!selectedDesarrollador || getDesarrolladoresDisponibles().length === 0}
            sx={{ 
              backgroundColor: '#312D2A',
              '&:hover': { backgroundColor: '#242220' }
            }}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SuperAdmin;