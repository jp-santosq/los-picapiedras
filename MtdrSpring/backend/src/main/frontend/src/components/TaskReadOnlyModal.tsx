import React from 'react';
import { Task } from '../context/TaskContext.tsx';
import { TaskStatus } from './enums.tsx';
import { useUsers } from '../context/UserContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import '../styles/components/modal.css';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import EqualizerIcon from '@mui/icons-material/Equalizer';


interface TaskReadOnlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const TaskReadOnlyModal: React.FC<TaskReadOnlyModalProps> = ({
  isOpen,
  onClose,
  task
}) => {
  const { getUserById } = useUsers();
  const { sprints } = useSprints();

  if (!isOpen || !task) return null;

  // Obtener nombre del responsable
  const getResponsibleName = (responsibleId: number | null | undefined): string => {
    if (!responsibleId) return 'Sin asignar';
    const responsible = getUserById(responsibleId);
    return responsible?.name || 'Desconocido';
  };

  const responsibleName = getResponsibleName(task.responsibleId);

  // Obtener información del sprint
  const sprint = task.sprintId ? sprints.find(s => s.id === task.sprintId) : null;
  const sprintLabel = sprint ? `Sprint #${sprint.id}` : 'Sin Sprint';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    // Compare against TaskStatus enum values (e.g. "To Do", "Doing")
    switch (status) {
      case TaskStatus.TODO:
        return { bg: '#e6eff7', color: '#083D77' };
      case TaskStatus.DOING:
        return { bg: '#fde3ea', color: '#EF2D56' };
      case TaskStatus.REVISION:
        return { bg: '#f8fbdc', color: '#7b861f' };
      case TaskStatus.DONE:
        return { bg: '#e6f7eb', color: '#1c7832' };
      default:
        return { bg: '#f8f9fa', color: '#495057' };
    }
  };

  const statusStyle = getStatusColor(task.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h2>{task.name}</h2>
            <span 
              className="sprint-status"
              style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
            >
              {task.status}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* Información General */}
          <div className="details-section">
            <h3 className="section-title"><InfoIcon className="section-icon" fontSize="small" /> Información General</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">ID de Tarea:</span>
                <span className="detail-value">#{task.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Proyecto:</span>
                <span className="detail-value">{task.projectId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sprint:</span>
                <span className="detail-value">{sprintLabel}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="details-section">
            <h3 className="section-title"><DescriptionIcon className="section-icon" fontSize="small" /> Descripción</h3>
            <p className="task-description-text">
              {task.description || 'Sin descripción'}
            </p>
          </div>

          {/* Asignación y Fechas */}
          <div className="details-section">
            <h3 className="section-title"><PersonIcon className="section-icon" fontSize="small" /> Asignación</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Responsable:</span>
                <span className="detail-value">{responsibleName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Fecha estimada:</span>
                <span className="detail-value">{formatDate(task.estimatedDate)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Story Points:</span>
                <span className="detail-value points-badge">{task.storyPoints}</span>
              </div>
            </div>
          </div>

          {/* Estado Actual */}
          <div className="details-section">
            <h3 className="section-title"><EqualizerIcon className="section-icon" fontSize="small" /> Estado Actual</h3>
            <div className="status-display">
              <span 
                className="status-display-badge"
                style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
              >
                {task.status}
              </span>
              <p className="status-description">
                {task.status === TaskStatus.TODO && 'Esta tarea está pendiente de iniciar'}
                {task.status === TaskStatus.DOING && 'Esta tarea está en progreso'}
                {task.status === TaskStatus.REVISION && 'Esta tarea está en revisión'}
                {task.status === TaskStatus.DONE && 'Esta tarea ha sido completada'}
              </p>
            </div>
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

export default TaskReadOnlyModal;