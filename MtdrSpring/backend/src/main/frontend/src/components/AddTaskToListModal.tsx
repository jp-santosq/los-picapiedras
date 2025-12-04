import React, { useState } from 'react';
import { TaskStatus } from './enums.tsx';
import { TempTask } from '../pages/SprintGenerator.tsx';
import '../styles/components/modal.css';

interface AddTaskToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: TempTask) => void;
}

const AddTaskToListModal: React.FC<AddTaskToListModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    estimatedDate: '',
    storyPoints: 0,
    status: TaskStatus.TODO,
    responsibleId: 0,
    projectId: 1,
    userStoryId: 1
  });
  
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'storyPoints' || name === 'responsibleId' || name === 'projectId' || name === 'userStoryId') {
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
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const newTask: TempTask = {
      name: formData.name,
      description: formData.description,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      estimatedDate: formData.estimatedDate,
      storyPoints: formData.storyPoints,
      status: formData.status,
      responsibleId: formData.responsibleId,
      projectId: formData.projectId,
      userStoryId: formData.userStoryId
    };

    onTaskAdded(newTask);
    
    // Resetear formulario
    setFormData({
      name: '',
      description: '',
      startDate: '',
      estimatedDate: '',
      storyPoints: 0,
      status: TaskStatus.TODO,
      responsibleId: 0,
      projectId: 1,
      userStoryId: 1
    });
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      estimatedDate: '',
      storyPoints: 0,
      status: TaskStatus.TODO,
      responsibleId: 0,
      projectId: 1,
      userStoryId: 1
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Agregar Nueva Tarea</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
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
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Describe la tarea..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Fecha Inicio</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-input"
              />
              <small className="form-hint">Opcional: si no se especifica, se usa la fecha actual</small>
            </div>

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
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label htmlFor="status">Estado Inicial</label>
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
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Agregar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskToListModal;