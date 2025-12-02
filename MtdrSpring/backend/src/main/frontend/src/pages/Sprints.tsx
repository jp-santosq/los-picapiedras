import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ROL } from '../components/enums.tsx';
import SprintCard from '../components/Sprint/SprintCard.tsx';
import CreateSprintModal from '../components/Sprint/CreateSprintModal.tsx';
import SprintDetailsModal from '../components/Sprint/SprintDetailsModal.tsx';
import ReplayIcon from '@mui/icons-material/Replay';
import ReportIcon from '@mui/icons-material/Report';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import '../styles/components/sprints.css';

const Sprints: React.FC = () => {
  const { sprints, loading, error, refreshSprints } = useSprints();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-refresh cuando la página se vuelve visible
  useEffect(() => {
    // Refrescar cuando la ventana vuelve a tener foco
    const handleFocus = () => {
      refreshSprints();
    };

    // Refrescar cuando el tab vuelve a estar visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSprints();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshSprints]);

  const handleSprintClick = (sprintId: number) => {
    setSelectedSprintId(sprintId);
    setIsDetailsModalOpen(true);
  };

  const getSprintStatus = (sprint: any): string => {
    const today = new Date();
    const start = new Date(sprint.fechaInicio);
    const end = new Date(sprint.fechaFinEstimada);

    if (sprint.fechaFinReal) return 'completed';
    if (today < start) return 'upcoming';
    if (today >= start && today <= end) return 'active';
    return 'overdue';
  };

  const filteredSprints = useMemo(() => {
    return sprints.filter(sprint => {
      const status = getSprintStatus(sprint);
      const matchesStatus = filterStatus === 'all' || status === filterStatus;
      const matchesSearch = sprint.id?.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    });
  }, [sprints, filterStatus, searchTerm]);

  const sortedSprints = useMemo(() => {
    return [...filteredSprints].sort((a, b) => {
      return new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime();
    });
  }, [filteredSprints]);

  const stats = useMemo(() => ({
    total: sprints.length,
    active: sprints.filter(s => getSprintStatus(s) === 'active').length,
    completed: sprints.filter(s => getSprintStatus(s) === 'completed').length,
    upcoming: sprints.filter(s => getSprintStatus(s) === 'upcoming').length,
  }), [sprints]);

  const selectedSprint = selectedSprintId 
    ? sprints.find(s => s.id === selectedSprintId) || null
    : null;

  return (
    <div className="sprints-page">
      <section className="page-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Panel de planificación</p>
          <h1 className="page-title">Gestión de Sprints</h1>
          <p className="page-subtitle">
            Administra y visualiza todos tus sprints de proyecto
          </p>
        </div>
        <div className="hero-actions">
          <button
            className="btn btn-primary hero-refresh"
            onClick={refreshSprints}
            aria-label="Actualizar sprints"
          >
          <ReplayIcon className="refresh-icon" fontSize="small" />
          </button>
          {(user?.rol === ROL.ADMINISTRADOR || user?.rol === ROL.SUPERADMIN) && (
            <>
              <button
                className="btn btn-primary hero-create"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Crear Sprint
              </button>
              <button
                className="btn btn-primary hero-create"
                onClick={() => navigate('/SprintGenerator')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <AutoAwesomeIcon fontSize="small" />
                Sprint Generator
              </button>
            </>
          )}
        </div>
      </section>

      <div className="stats-panel">
        <div className="stat-card accent-total">
          <div>
            <p className="stat-label">Total de sprints</p>
            <p className="stat-value">{stats.total}</p>
          </div>
          <span className="stat-footnote">Registro general</span>
        </div>
        <div className="stat-card accent-active">
          <div>
            <p className="stat-label">En progreso</p>
            <p className="stat-value">{stats.active}</p>
          </div>
          <span className="stat-footnote">Sprints activos</span>
        </div>
        <div className="stat-card accent-completed">
          <div>
            <p className="stat-label">Completados</p>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <span className="stat-footnote">Finalizados correctamente</span>
        </div>
        <div className="stat-card accent-upcoming">
          <div>
            <p className="stat-label">Por iniciar</p>
            <p className="stat-value">{stats.upcoming}</p>
          </div>
          <span className="stat-footnote">Programados</span>
        </div>
      </div>

      <div className="filters-panel">
        <div className="search-group">
          <label htmlFor="sprint-search">Buscar sprint</label>
          <input
            id="sprint-search"
            type="text"
            placeholder="ID del sprint"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          <span className="filter-label">Estado</span>
          <div className="filter-options">
            <button
              className={`filter-chip ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Todos
            </button>
            <button
              className={`filter-chip ${filterStatus === 'active' ? 'active' : ''}`}
              onClick={() => setFilterStatus('active')}
            >
              En progreso
            </button>
            <button
              className={`filter-chip ${filterStatus === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterStatus('upcoming')}
            >
              Por iniciar
            </button>
            <button
              className={`filter-chip ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              Completados
            </button>
          </div>
        </div>
      </div>

      <div className="sprints-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Cargando sprints...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refreshSprints}>
              Reintentar
            </button>
          </div>
        ) : sortedSprints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-graphic" aria-hidden="true">
              <ReportIcon fontSize="large" />
            </div>
            <h3>Sin sprints registrados</h3>
            <p className="empty-text">
              {searchTerm || filterStatus !== 'all'
                ? 'No se encontraron sprints con los filtros aplicados'
                : 'Comienza creando tu primer sprint'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                className="btn btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Crear Sprint
              </button>
            )}
          </div>
        ) : (
          <div className="sprints-list">
            {sortedSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onClick={() => handleSprintClick(sprint.id)}
              />
            ))}
          </div>
        )}
      </div>

      <CreateSprintModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSprintCreated={() => {}}
      />

      <SprintDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSprintId(null);
        }}
        sprint={selectedSprint}
      />
    </div>
  );
};

export default Sprints;
