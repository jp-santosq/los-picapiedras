import React, { useState, useMemo } from 'react';
import { useSprints } from '../context/SprintContext';
import SprintCard from '../components/Sprint/SprintCard';
import CreateSprintModal from '../components/Sprint/CreateSprintModal';
import SprintDetailsModal from '../components/Sprint/SprintDetailsModal';
import '../styles/components/sprints.css';

const Sprints: React.FC = () => {
  const { sprints, loading, error, refreshSprints } = useSprints();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Sprints</h1>
          <p className="page-subtitle">
            Administra y visualiza todos tus sprints de proyecto
          </p>
        </div>
        <button
          className="btn btn-primary btn-create"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Crear Sprint
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <span className="stat-value">{stats.active}</span>
            <span className="stat-label">En Progreso</span>
          </div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <span className="stat-value">{stats.completed}</span>
            <span className="stat-label">Completados</span>
          </div>
        </div>
        <div className="stat-card stat-upcoming">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-value">{stats.upcoming}</span>
            <span className="stat-label">Por Iniciar</span>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Todos
          </button>
          <button
            className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            En Progreso
          </button>
          <button
            className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilterStatus('upcoming')}
          >
            Por Iniciar
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completados
          </button>
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
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={refreshSprints}>
              Reintentar
            </button>
          </div>
        ) : sortedSprints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay sprints disponibles</h3>
            <p>
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
