import React, { useState } from 'react';
import axios from 'axios';
import '../styles/components/modal.css';

interface CreateSprintForGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintCreated: (sprintId: number) => void;
}

const CreateSprintForGenerator: React.FC<CreateSprintForGeneratorProps> = ({
  isOpen,
  onClose,
  onSprintCreated
}) => {
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFinEstimada: '',
    proyectoId: 1 // Hardcoded como solicitaste
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    const startDate = new Date(formData.fechaInicio);
    const endDate = new Date(formData.fechaFinEstimada);
    
    if (endDate <= startDate) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }

    // Validar que la fecha de inicio no sea en el pasado
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      setError('La fecha de inicio no puede ser anterior a hoy');
      return false;
    }

    return true;
  };

  const getLatestSprintId = async (): Promise<number> => {
    try {
      const response = await axios.get('/sprint/all');
      const sprints = response.data;
      
      if (sprints && sprints.length > 0) {
        // Ordenar por ID descendente y obtener el último
        const sortedSprints = [...sprints].sort((a, b) => b.id - a.id);
        return sortedSprints[0].id;
      }
      
      return 0;
    } catch (error) {
      console.error('Error obteniendo sprints:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Crear el sprint
      const sprintDTO = {
        fechaInicio: formData.fechaInicio,
        fechaFinEstimada: formData.fechaFinEstimada,
        proyectoId: formData.proyectoId
      };

      console.log('Creando sprint con datos:', sprintDTO);
      
      await axios.post('/sprint/add', sprintDTO);
      
      // Obtener el ID del sprint recién creado
      const newSprintId = await getLatestSprintId();
      
      console.log('Sprint creado con ID:', newSprintId);
      
      // Resetear formulario
      setFormData({
        fechaInicio: '',
        fechaFinEstimada: '',
        proyectoId: 1
      });
      
      // Notificar al componente padre con el ID del sprint
      onSprintCreated(newSprintId);
      
    } catch (err: any) {
      console.error('Error al crear sprint:', err);
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
      proyectoId: 1
    });
    onClose();
  };

  if (!isOpen) return null;

  // Calcular la fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-sprint-create" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📅 Configura tu Nuevo Sprint</h2>
            <p className="modal-subtitle">Define las fechas para planificar tu sprint con IA</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <div className="sprint-info-box">
            <div className="info-icon">ℹ️</div>
            <div>
              <p className="info-title">¿Qué es un Sprint?</p>
              <p className="info-text">
                Un sprint es un período de tiempo fijo (generalmente 1-4 semanas) donde tu equipo 
                trabajará en un conjunto específico de tareas.
              </p>
            </div>
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
              min={today}
            />
            <small className="form-hint">
              El día en que comenzará el sprint
            </small>
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
              min={formData.fechaInicio || today}
            />
            <small className="form-hint">
              El día en que planeas completar el sprint
            </small>
          </div>

          {/* Mostrar duración calculada */}
          {formData.fechaInicio && formData.fechaFinEstimada && (
            <div className="sprint-duration-box">
              <span className="duration-label">Duración del Sprint:</span>
              <span className="duration-value">
                {Math.ceil(
                  (new Date(formData.fechaFinEstimada).getTime() - 
                   new Date(formData.fechaInicio).getTime()) / 
                  (1000 * 60 * 60 * 24)
                )} días
              </span>
            </div>
          )}

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
              {loading ? 'Creando Sprint...' : 'Continuar →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintForGenerator;