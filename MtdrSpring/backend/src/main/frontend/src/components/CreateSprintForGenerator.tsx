import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.tsx';
import '../styles/components/modal.css';

export interface SprintData {
  fechaInicio: string;
  fechaFinEstimada: string;
  proyectoId: number;
}

interface CreateSprintForGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSprintDataCaptured: (sprintData: SprintData) => void;
}

const CreateSprintForGenerator: React.FC<CreateSprintForGeneratorProps> = ({
  isOpen,
  onClose,
  onSprintDataCaptured
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFinEstimada: '',
    proyectoId: 0 // Se cargará dinámicamente
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  // Obtener el proyecto del usuario al montar el componente
  useEffect(() => {
    const fetchUserProject = async () => {
      if (!user) return;

      try {
        setLoadingProject(true);
        
        // Primero intentar obtener proyectos como administrador
        const responseAdmin = await axios.get(`/proyecto/administrador/${user.id}`);
        
        if (responseAdmin.data && responseAdmin.data.length > 0) {
          // Usuario es administrador de al menos un proyecto
          setFormData(prev => ({
            ...prev,
            proyectoId: responseAdmin.data[0].id
          }));
          return;
        }
        
        // Si no es admin, obtener proyectos como miembro
        const responseMiembro = await axios.get(`/usuarioProyecto/usuario/${user.id}`);
        
        if (responseMiembro.data && responseMiembro.data.length > 0) {
          // Usuario es miembro de al menos un proyecto
          setFormData(prev => ({
            ...prev,
            proyectoId: responseMiembro.data[0].proyecto.id
          }));
        } else {
          setError('No tienes proyectos asignados. Contacta al administrador.');
        }
      } catch (err: any) {
        console.error('Error al obtener proyecto del usuario:', err);
        setError('Error al cargar tu proyecto');
      } finally {
        setLoadingProject(false);
      }
    };

    if (isOpen) {
      fetchUserProject();
    }
  }, [user, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    // No crear el sprint aún, solo pasar los datos al siguiente paso
    const sprintData: SprintData = {
      fechaInicio: formData.fechaInicio,
      fechaFinEstimada: formData.fechaFinEstimada,
      proyectoId: formData.proyectoId
    };

    console.log('Datos del sprint capturados:', sprintData);
    
    // Resetear formulario (mantener el proyectoId del usuario)
    setFormData(prev => ({
      fechaInicio: '',
      fechaFinEstimada: '',
      proyectoId: prev.proyectoId
    }));
    
    // Pasar los datos al siguiente paso
    onSprintDataCaptured(sprintData);
  };

  const handleClose = () => {
    setError(null);
    // Resetear formulario (mantener el proyectoId del usuario)
    setFormData(prev => ({
      fechaInicio: '',
      fechaFinEstimada: '',
      proyectoId: prev.proyectoId
    }));
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

        {loadingProject ? (
          <div className="modal-form" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Cargando información del proyecto...</p>
          </div>
        ) : (
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
              disabled={formData.proyectoId === 0}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formData.proyectoId === 0}
            >
              Continuar →
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default CreateSprintForGenerator;