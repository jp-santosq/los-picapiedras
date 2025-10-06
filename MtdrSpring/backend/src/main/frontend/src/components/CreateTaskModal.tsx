import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
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
  
  const [formData, setFormData] = useState({
    name: '',
    responsible: '',
    responsibleId: 0,
    estimatedDate: '',
    storyPoints: 0,
    description: '',
    project: 'los-picapiedras #X',
    status: TaskStatus.TODO
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storyPoints' || name === 'responsibleId') {
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
    if (!formData.responsible.trim()) {
      setError('El responsable es requerido');
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
      addTask(formData);
      
      // Resetear formulario
      setFormData({
        name: '',
        responsible: '',
        responsibleId: 0,
        estimatedDate: '',
        storyPoints: 0,
        description: '',
        project: 'los-picapiedras #X',
        status: TaskStatus.TODO
      });
      
      onTaskCreated();
      onClose();
    } catch (err: any) {
      setError('Error al crear la tarea');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: '',
      responsible: '',
      responsibleId: 0,
      estimatedDate: '',
      storyPoints: 0,
      description: '',
      project: 'los-picapiedras #X',
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
            <label htmlFor="responsible">
              Responsable <span className="required">*</span>
            </label>
            <input
              type="text"
              id="responsible"
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Nombre del responsable"
            />
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
              disabled={loading}
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