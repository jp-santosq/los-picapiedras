import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import axios from "axios";
import { ROL } from "./enums.tsx";
import "../styles/components/superadmin.css";

type Usuario = {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: {
    id: ROL;
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
  const { user, logout } = useAuth();
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
      const response = await axios.get("/usuario/rol/3");
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

  const handleLogout = () => {
    logout();
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
      <div className="superadmin-loading">
        <p>Debes iniciar sesión</p>
      </div>
    );
  }

  return (
    <div className="superadmin-container">
      {/* Header */}
      <div className="superadmin-header">
        <h1 className="superadmin-title">Panel de Proyectos</h1>
        <div className="superadmin-actions">
          <button
            className="superadmin-btn superadmin-btn-primary"
            onClick={handleOpenDialog}
          >
            <span>➕</span>
            Nuevo Proyecto
          </button>
          <button
            className="superadmin-btn superadmin-btn-secondary"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {loading ? (
        <div className="superadmin-loading">
          <p>Cargando proyectos...</p>
        </div>
      ) : proyectos.length === 0 ? (
        <div className="superadmin-empty">
          <div className="superadmin-empty-icon">📁</div>
          <h2 className="superadmin-empty-title">No hay proyectos registrados</h2>
        </div>
      ) : (
        <div className="superadmin-projects-grid">
          {proyectos.map((proyecto) => (
            <div
              key={proyecto.id}
              className="superadmin-project-card"
              onClick={() => handleOpenDetailDialog(proyecto)}
            >
              {/* Nombre del Proyecto */}
              <div className="project-card-header">
                <span
                  className="project-card-icon"
                  style={{ color: getAdminColor(proyecto.administrador?.id || 0) }}
                >
                  📁
                </span>
                <h3 className="project-card-name">{proyecto.nombreProyecto}</h3>
              </div>

              <div className="project-card-divider" />

              {/* Administrador */}
              <div className="project-card-admin">
                <div
                  className="project-card-avatar"
                  style={{ backgroundColor: getAdminColor(proyecto.administrador?.id || 0) }}
                >
                  {proyecto.administrador?.nombreUsuario?.charAt(0) || '?'}
                </div>
                <div className="project-card-admin-info">
                  <p className="project-card-admin-name">
                    {proyecto.administrador?.nombreUsuario || 'Sin asignar'}
                  </p>
                  <p className="project-card-admin-email">
                    {proyecto.administrador?.correo || ''}
                  </p>
                </div>
              </div>

              {/* Info Sprints */}
              <div className="project-card-info">
                <p className="project-card-info-text">
                  Sprints: <strong>{proyecto.sprints?.length || 0}</strong>
                </p>
              </div>

              {/* ID */}
              <p className="project-card-id">ID: {proyecto.id}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dialog Crear Proyecto */}
      {openDialog && (
        <div className="modal-overlay" onClick={handleCloseDialog}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Crear Nuevo Proyecto</h2>
              <button className="modal-close-btn" onClick={handleCloseDialog}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <p className="alert-text">{error}</p>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Nombre del Proyecto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ingrese el nombre del proyecto"
                  value={nuevoProyecto.nombreProyecto}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, nombreProyecto: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Administrador del Proyecto</label>
                <select
                  className="form-select"
                  value={nuevoProyecto.administradorId}
                  onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, administradorId: e.target.value })}
                >
                  <option value="">Seleccionar administrador</option>
                  {administradores.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.nombreUsuario} - {admin.correo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="superadmin-btn superadmin-btn-secondary" onClick={handleCloseDialog}>
                Cancelar
              </button>
              <button className="superadmin-btn superadmin-btn-primary" onClick={handleCreateProyecto}>
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Detalle del Proyecto con Miembros */}
      {openDetailDialog && selectedProyecto && (
        <div className="modal-overlay" onClick={handleCloseDetailDialog}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                <span style={{ color: getAdminColor(selectedProyecto.administrador?.id || 0) }}>
                  📁
                </span>
                {selectedProyecto.nombreProyecto}
              </h2>
              <button className="modal-close-btn" onClick={handleCloseDetailDialog}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {/* Mensaje de éxito */}
              {successMessage && (
                <div className="alert alert-success">
                  <span className="alert-icon">✓</span>
                  <p className="alert-text">{successMessage}</p>
                </div>
              )}

              {/* Administrador destacado */}
              <div className="detail-section">
                <p className="detail-section-title">Administrador del Proyecto</p>
                <div className="admin-card">
                  <div
                    className="admin-avatar"
                    style={{ backgroundColor: getAdminColor(selectedProyecto.administrador?.id || 0) }}
                  >
                    {selectedProyecto.administrador?.nombreUsuario?.charAt(0) || '?'}
                  </div>
                  <div className="admin-info">
                    <div className="admin-name-row">
                      <h3 className="admin-name">
                        {selectedProyecto.administrador?.nombreUsuario}
                      </h3>
                      <span className="admin-badge">
                        ⭐ Admin
                      </span>
                    </div>
                    <p className="admin-email">
                      {selectedProyecto.administrador?.correo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="project-card-divider" style={{ margin: '2rem 0' }} />

              {/* Miembros del Proyecto */}
              <div className="detail-section">
                <div className="members-header">
                  <p className="members-count">
                    Miembros del Proyecto ({miembrosProyecto.length})
                  </p>
                  <button
                    className="superadmin-btn superadmin-btn-secondary"
                    style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                    onClick={handleOpenAddMemberDialog}
                  >
                    <span>➕</span>
                    Agregar Miembro
                  </button>
                </div>

                {loadingMiembros ? (
                  <div className="superadmin-loading" style={{ minHeight: '150px' }}>
                    <p>Cargando miembros...</p>
                  </div>
                ) : miembrosProyecto.length === 0 ? (
                  <div className="members-empty">
                    <p className="members-empty-text">
                      No hay miembros asignados a este proyecto
                    </p>
                  </div>
                ) : (
                  <div className="members-list">
                    {miembrosProyecto.map((usuarioProyecto) => (
                      <div
                        key={usuarioProyecto.id}
                        className={`member-card ${isAdministrador(usuarioProyecto.usuario.id) ? 'is-admin' : ''}`}
                      >
                        <div
                          className="member-avatar"
                          style={{ backgroundColor: getAdminColor(usuarioProyecto.usuario.id) }}
                        >
                          {usuarioProyecto.usuario.nombreUsuario.charAt(0)}
                        </div>
                        <div className="member-info">
                          <div className="member-name-row">
                            <p className="member-name">
                              {usuarioProyecto.usuario.nombreUsuario}
                            </p>
                            {isAdministrador(usuarioProyecto.usuario.id) && (
                              <span className="member-badge">
                                ⭐ Admin
                              </span>
                            )}
                          </div>
                          <p className="member-email">
                            {usuarioProyecto.usuario.correo}
                          </p>
                        </div>
                        <span className="member-role-badge">
                          Rol ID: {usuarioProyecto.usuario.rol.id}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Información adicional del proyecto */}
              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-label">Sprints</p>
                    <p className="stat-value">{selectedProyecto.sprints?.length || 0}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-label">ID del Proyecto</p>
                    <p className="stat-value">{selectedProyecto.id}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="superadmin-btn superadmin-btn-secondary" onClick={handleCloseDetailDialog}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog Agregar Miembro */}
      {openAddMemberDialog && (
        <div className="modal-overlay" onClick={handleCloseAddMemberDialog}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Agregar Desarrollador al Proyecto</h2>
              <button className="modal-close-btn" onClick={handleCloseAddMemberDialog}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">⚠️</span>
                  <p className="alert-text">{error}</p>
                </div>
              )}

              <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                Proyecto: <strong>{selectedProyecto?.nombreProyecto}</strong>
              </p>

              <div className="form-group">
                <label className="form-label">Seleccionar Desarrollador</label>
                <select
                  className="form-select"
                  value={selectedDesarrollador}
                  onChange={(e) => setSelectedDesarrollador(e.target.value)}
                >
                  <option value="">Seleccionar desarrollador</option>
                  {getDesarrolladoresDisponibles().length === 0 ? (
                    <option disabled>No hay desarrolladores disponibles</option>
                  ) : (
                    getDesarrolladoresDisponibles().map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.nombreUsuario} - {dev.correo}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="superadmin-btn superadmin-btn-secondary" onClick={handleCloseAddMemberDialog}>
                Cancelar
              </button>
              <button
                className="superadmin-btn superadmin-btn-primary"
                onClick={handleAddMember}
                disabled={!selectedDesarrollador || getDesarrolladoresDisponibles().length === 0}
                style={{
                  opacity: (!selectedDesarrollador || getDesarrolladoresDisponibles().length === 0) ? 0.5 : 1,
                  cursor: (!selectedDesarrollador || getDesarrolladoresDisponibles().length === 0) ? 'not-allowed' : 'pointer'
                }}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdmin;