import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { TaskStatus } from './enums.tsx';
import '../styles/components/modal.css';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated
}) => {
  const { addTask } = useTasks();
  const { sprints } = useSprints();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    estimatedDate: '',
    storyPoints: 0,
    description: '',
    sprintId: 0,
    status: TaskStatus.TODO
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storyPoints' || name === 'sprintId') {
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
    if (!user) {
      setError('Debes iniciar sesión para crear tareas');
      return false;
    }
    if (formData.sprintId === 0) {
      setError('Debes seleccionar un sprint');
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Agregar datos del usuario autenticado
      const taskData = {
        ...formData,
        responsible: user!.name,
        responsibleId: user!.id,
        project: '' // Se obtendrá del backend
      };

      await addTask(taskData);
      
      // Resetear formulario
      setFormData({
        name: '',
        estimatedDate: '',
        storyPoints: 0,
        description: '',
        sprintId: 0,
        status: TaskStatus.TODO
      });
      
      onTaskCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear la tarea');
      console.error('Error en handleSubmit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: '',
      estimatedDate: '',
      storyPoints: 0,
      description: '',
      sprintId: 0,
      status: TaskStatus.TODO
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nueva Tarea</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Mostrar usuario asignado */}
          <div className="form-group">
            <label>Responsable Asignado</label>
            <div className="assigned-user">
              <span className="user-badge">
                👤 {user?.name || 'No autenticado'}
              </span>
              <small className="form-hint">
                Esta tarea será asignada a tu usuario
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Nombre de la Tarea <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Ej: Implementar login"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sprintId">
              Sprint <span className="required">*</span>
            </label>
            <select
              id="sprintId"
              name="sprintId"
              value={formData.sprintId}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value={0}>Selecciona un sprint</option>
              {sprints.map(sprint => (
                <option key={sprint.id} value={sprint.id}>
                  Sprint #{sprint.id} 
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedDate">
                Fecha Estimada <span className="required">*</span>
              </label>
              <input
                type="date"
                id="estimatedDate"
                name="estimatedDate"
                value={formData.estimatedDate}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="storyPoints">
                Story Points <span className="required">*</span>
              </label>
              <input
                type="number"
                id="storyPoints"
                name="storyPoints"
                value={formData.storyPoints}
                onChange={handleChange}
                required
                className="form-input"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Describe la tarea..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">
              Estado Inicial
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value={TaskStatus.TODO}>TODO</option>
              <option value={TaskStatus.DOING}>DOING</option>
              <option value={TaskStatus.REVISION}>REVISION</option>
              <option value={TaskStatus.DONE}>DONE</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !user}
            >
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;