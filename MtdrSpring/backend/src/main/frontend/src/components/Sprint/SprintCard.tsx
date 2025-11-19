import React from 'react';
import '../../styles/components/sprintCard.css';

interface SprintCardProps {
  sprint: any;
  onClick: () => void;
}

const SprintCard: React.FC<SprintCardProps> = ({ sprint, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDuration = () => {
    const start = new Date(sprint.fechaInicio);
    const end = new Date(sprint.fechaFinEstimada);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatus = () => {
    const today = new Date();
    const start = new Date(sprint.fechaInicio);
    const end = new Date(sprint.fechaFinEstimada);

    if (sprint.fechaFinReal) {
      return { label: 'Completado', className: 'status-completed' };
    } else if (today < start) {
      return { label: 'Por iniciar', className: 'status-upcoming' };
    } else if (today >= start && today <= end) {
      return { label: 'En progreso', className: 'status-active' };
    } else {
      return { label: 'Atrasado', className: 'status-overdue' };
    }
  };

  const status = getStatus();
  const duration = calculateDuration();

  return (
    <div className="sprint-card" onClick={onClick}>
      <div className="sprint-card-header">
        <div className="sprint-info">
          <h3 className="sprint-title">Sprint #{sprint.id}</h3>
          <span className={`sprint-status ${status.className}`}>
            {status.label}
          </span>
        </div>
        <div className="sprint-duration">
          <span className="duration-label">Duración</span>
          <span className="duration-value">{duration} días</span>
        </div>
      </div>

      <div className="sprint-card-body">
        <div className="date-info">
          <div className="date-item">
            <span className="date-label">Inicio:</span>
            <span className="date-value">{formatDate(sprint.fechaInicio)}</span>
          </div>
          <div className="date-separator" aria-hidden="true"></div>
          <div className="date-item">
            <span className="date-label">Fin estimado:</span>
            <span className="date-value">{formatDate(sprint.fechaFinEstimada)}</span>
          </div>
          {sprint.fechaFinReal && (
            <>
              <div className="date-separator" aria-hidden="true"></div>
              <div className="date-item">
                <span className="date-label">Fin real:</span>
                <span className="date-value">{formatDate(sprint.fechaFinReal)}</span>
              </div>
            </>
          )}
        </div>

        {sprint.tareas && sprint.tareas.length > 0 && (
          <div className="sprint-tasks-info">
            <span className="tasks-label">Tareas asignadas</span>
            <span className="tasks-count">
              {sprint.tareas.length} {sprint.tareas.length === 1 ? 'tarea' : 'tareas'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SprintCard;
