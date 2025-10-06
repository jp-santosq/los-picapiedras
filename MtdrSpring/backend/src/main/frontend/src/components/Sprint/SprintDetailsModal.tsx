import React from 'react';
import '../../styles/components/modal.css';

interface SprintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: any | null;
}

const SprintDetailsModal: React.FC<SprintDetailsModalProps> = ({
  isOpen,
  onClose,
  sprint
}) => {
  if (!isOpen || !sprint) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateProgress = () => {
    const today = new Date();
    const start = new Date(sprint.fechaInicio);
    const end = new Date(sprint.fechaFinEstimada);
    
    if (today < start) return 0;
    if (today > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const current = today.getTime() - start.getTime();
    return Math.round((current / total) * 100);
  };

  const calculateDaysRemaining = () => {
    const today = new Date();
    const end = new Date(sprint.fechaFinEstimada);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} días de retraso`;
    if (diffDays === 0) return 'Último día';
    if (diffDays === 1) return '1 día restante';
    return `${diffDays} días restantes`;
  };

  const getStatusInfo = () => {
    const today = new Date();
    const start = new Date(sprint.fechaInicio);
    const end = new Date(sprint.fechaFinEstimada);

    if (sprint.fechaFinReal) {
      return {
        label: 'Completado',
        className: 'status-completed',
        icon: '✓'
      };
    } else if (today < start) {
      return {
        label: 'Por iniciar',
        className: 'status-upcoming',
        icon: '📅'
      };
    } else if (today >= start && today <= end) {
      return {
        label: 'En progreso',
        className: 'status-active',
        icon: '🚀'
      };
    } else {
      return {
        label: 'Atrasado',
        className: 'status-overdue',
        icon: '⚠️'
      };
    }
  };

  const progress = calculateProgress();
  const status = getStatusInfo();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>Sprint #{sprint.id}</h2>
            <span className={`sprint-status ${status.className}`}>
              {status.icon} {status.label}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {!sprint.fechaFinReal && (
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">Progreso del Sprint</span>
                <span className="progress-percentage">{progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="progress-info">
                {calculateDaysRemaining()}
              </div>
            </div>
          )}

          <div className="details-section">
            <h3 className="section-title">📅 Fechas</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Fecha de inicio:</span>
                <span className="detail-value">{formatDate(sprint.fechaInicio)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha de fin estimada:</span>
                <span className="detail-value">{formatDate(sprint.fechaFinEstimada)}</span>
              </div>
              {sprint.fechaFinReal && (
                <div className="detail-item">
                  <span className="detail-label">Fecha de fin real:</span>
                  <span className="detail-value highlight">{formatDate(sprint.fechaFinReal)}</span>
                </div>
              )}
            </div>
          </div>

          {sprint.proyecto && (
            <div className="details-section">
              <h3 className="section-title">📁 Proyecto</h3>
              <div className="detail-item">
                <span className="detail-label">ID del proyecto:</span>
                <span className="detail-value">{sprint.proyecto.id}</span>
              </div>
              {sprint.proyecto.nombreProyecto && (
                <div className="detail-item">
                  <span className="detail-label">Nombre:</span>
                  <span className="detail-value">{sprint.proyecto.nombreProyecto}</span>
                </div>
              )}
            </div>
          )}

          <div className="details-section">
            <h3 className="section-title">
              📋 Tareas 
              {sprint.tareas && sprint.tareas.length > 0 && (
                <span className="count-badge">{sprint.tareas.length}</span>
              )}
            </h3>
            {sprint.tareas && sprint.tareas.length > 0 ? (
              <div className="tasks-list">
                {sprint.tareas.map((tarea: any, index: number) => (
                  <div key={index} className="task-item">
                    <span className="task-title">
                      {tarea.titulo || `Tarea #${tarea.id}`}
                    </span>
                    {tarea.estadoTarea && (
                      <span className="task-status">
                        {tarea.estadoTarea.nombre}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No hay tareas asignadas a este sprint</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SprintDetailsModal;