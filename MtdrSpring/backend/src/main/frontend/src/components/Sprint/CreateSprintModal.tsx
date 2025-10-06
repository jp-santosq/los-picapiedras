import React, { useState } from 'react';
import { useSprints } from '../../context/SprintContext';
import '../../styles/components/modal.css';

interface CreateSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintCreated: () => void;
  proyectoId?: number;
}

const CreateSprintModal: React.FC<CreateSprintModalProps> = ({
  isOpen,
  onClose,
  onSprintCreated,
  proyectoId
}) => {
  const { addSprint } = useSprints();
  
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFinEstimada: '',
    proyectoId: proyectoId || 0
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'proyectoId') {
      setFormData(prev => ({
        ...prev,
        proyectoId: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fechaInicio) {
      setError('La fecha de inicio es requerida');
      return false;
    }
    if (!formData.fechaFinEstimada) {
      setError('La fecha de fin estimada es requerida');
      return false;
    }
    if (!formData.proyectoId || formData.proyectoId === 0) {
      setError('Debe seleccionar un proyecto');
      return false;
    }

    const startDate = new Date(formData.fechaInicio);
    const endDate = new Date(formData.fechaFinEstimada);
    
    if (endDate <= startDate) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
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
      await addSprint({
        fechaInicio: formData.fechaInicio,
        fechaFinEstimada: formData.fechaFinEstimada,
        proyecto: { id: formData.proyectoId }
      });
      
      setFormData({
        fechaInicio: '',
        fechaFinEstimada: '',
        proyectoId: proyectoId || 0
      });
      
      onSprintCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el sprint');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setFormData({
      fechaInicio: '',
      fechaFinEstimada: '',
      proyectoId: proyectoId || 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nuevo Sprint</h2>
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
            <label htmlFor="proyectoId">
              Proyecto <span className="required">*</span>
            </label>
            <input
              type="number"
              id="proyectoId"
              name="proyectoId"
              value={formData.proyectoId || ''}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="ID del proyecto"
              disabled={!!proyectoId}
            />
            <small className="form-help">
              Ingresa el ID del proyecto al que pertenece este sprint
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="fechaInicio">
              Fecha de Inicio <span className="required">*</span>
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaFinEstimada">
              Fecha de Fin Estimada <span className="required">*</span>
            </label>
            <input
              type="date"
              id="fechaFinEstimada"
              name="fechaFinEstimada"
              value={formData.fechaFinEstimada}
              onChange={handleChange}
              required
              className="form-input"
              min={formData.fechaInicio}
            />
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
              {loading ? 'Creando...' : 'Crear Sprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintModal;