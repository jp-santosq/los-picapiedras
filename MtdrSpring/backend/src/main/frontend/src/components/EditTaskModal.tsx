import React, { useState, useEffect } from 'react';
import { Task, useTasks } from '../context/TaskContext.tsx';
import { TaskStatus } from './enums.tsx';
import { useUsers } from '../context/UserContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ROL } from './enums.tsx';
import '../styles/components/modal.css';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  task
}) => {
  const { updateTask } = useTasks();
  const { users } = useUsers();
  const { sprints } = useSprints();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determinar si el usuario es administrador
  const isAdmin = user?.rol === ROL.ADMINISTRADOR || user?.rol === ROL.SUPERADMIN;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    estimatedDate: '',
    storyPoints: 0,
    status: TaskStatus.TODO,
    responsibleId: 0,
    sprintId: 0
  });

  useEffect(() => {
    if (isOpen && task) {
      setFormData({
        name: task.name,
        description: task.description,
        startDate: task.startDate,
        estimatedDate: task.estimatedDate,
        storyPoints: task.storyPoints,
        status: task.status,
        responsibleId: task.responsibleId,
        sprintId: task.sprintId || 0
      });
      setError(null);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storyPoints' || name === 'responsibleId' || name === 'sprintId') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('El nombre de la tarea es requerido');
      return false;
    }
    if (!formData.estimatedDate) {
      setError('La fecha estimada es requerida');
      return false;
    }
    if (formData.storyPoints < 0) {
      setError('Los story points deben ser un número positivo');
      return false;
    }
    // Solo validar responsable si el usuario es admin
    if (isAdmin && (!formData.responsibleId || formData.responsibleId === 0)) {
      setError('Debe asignar un responsable a la tarea');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);

    try {
      const updatedData: Partial<Task> = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate,
        estimatedDate: formData.estimatedDate,
        storyPoints: formData.storyPoints,
        status: formData.status,
        sprintId: formData.sprintId || undefined
      };

      // Solo los admins pueden cambiar el responsable
      if (isAdmin) {
        updatedData.responsibleId = formData.responsibleId;
      }

      await updateTask(task.id, updatedData);
      console.log(`Tarea ${task.id} actualizada exitosamente`);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la tarea');
      console.error('Error al actualizar tarea:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Tarea</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px' }}>
              <span className="alert-icon">⚠️</span>
              <p className="alert-text">{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-name">
              Nombre de la Tarea <span className="required">*</span>
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: Implementar login"
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-description">Descripción</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Describe la tarea..."
              rows={3}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="edit-startDate">Fecha Inicio</label>
              <input
                type="date"
                id="edit-startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-estimatedDate">
                Fecha Estimada <span className="required">*</span>
              </label>
              <input
                type="date"
                id="edit-estimatedDate"
                name="estimatedDate"
                value={formData.estimatedDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="edit-storyPoints">
                Story Points <span className="required">*</span>
              </label>
              <input
                type="number"
                id="edit-storyPoints"
                name="storyPoints"
                value={formData.storyPoints}
                onChange={handleChange}
                required
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-status">Estado</label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
              >
                <option value={TaskStatus.TODO}>POR HACER</option>
                <option value={TaskStatus.DOING}>EN PROGRESO</option>
                <option value={TaskStatus.REVISION}>EN REVISIÓN</option>
                <option value={TaskStatus.DONE}>COMPLETADO</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '1rem' }}>
            {isAdmin && (
              <div className="form-group">
                <label htmlFor="edit-responsible">
                  Responsable <span className="required">*</span>
                </label>
                <select
                  id="edit-responsible"
                  name="responsibleId"
                  value={formData.responsibleId}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value={0}>Seleccionar responsable</option>
                  {users
                    .filter(u => u.rol === 3) // Filtrar solo desarrolladores (rol ID 3)
                    .map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="edit-sprint">Sprint</label>
              <select
                id="edit-sprint"
                name="sprintId"
                value={formData.sprintId}
                onChange={handleChange}
                className="form-input"
              >
                <option value={0}>Sin Sprint</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>
                    Sprint #{sprint.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
            <button 
              type="button"
              onClick={handleClose} 
              className="btn btn-secondary"
              disabled={isUpdating}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
