import React, { useState } from 'react';
import axios from 'axios';
import { TaskStatus } from '../components/enums.tsx';
import AddTaskToListModal from '../components/AddTaskToListModal.tsx';
import TaskAssignmentBoard from '../components/TaskAssignmentBoard.tsx';
import '../styles/components/sprintGenerator.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (file: File) => void;
}

// el modal para subir el archivo
const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleContinue = () => {
    if (selectedFile) {
      onContinue(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-upload" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📄 Sube tu documento</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="upload-instruction">
            Sube el documento con los requisitos de tu sprint para que la IA te ayude a planificarlo
          </p>

          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="file-info">
                <div className="file-icon">📎</div>
                <div className="file-details">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p className="upload-text">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="upload-hint">
                  Formatos aceptados: .doc, .docx, .txt
                </p>
              </>
            )}
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".doc,.docx,.txt"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleContinue}
            className="btn btn-primary"
            disabled={!selectedFile}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

// Interfaz para las tareas temporales
export interface TempTask {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  estimatedDate: string;
  storyPoints: number;
  status: TaskStatus;
  responsibleId: number;
  sprintId?: number;
  projectId: number;
  userStoryId: number;
}

interface TasksReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (tasks: TempTask[]) => void;
  uploadedFile: File | null;
}

// es el modal que sugiere la lista de tareas y puedes modificarlas
const TasksReviewModal: React.FC<TasksReviewModalProps> = ({ isOpen, onClose, onContinue, uploadedFile }) => {
  const [tasks, setTasks] = useState<TempTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Cargar tareas del endpoint cuando se abre el modal
  React.useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchTasks();
    }
  }, [isOpen, hasLoaded]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      // Verificar que hay un archivo subido
      if (!uploadedFile) {
        setError('No se ha subido ningún archivo');
        setLoading(false);
        return;
      }

      // Crear FormData con el archivo
      const formData = new FormData();
      formData.append('archivo', uploadedFile);

      // Hacer POST al endpoint con el archivo
      const response = await axios.post('/tarea/plan-sprint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const tareasBackend = response.data as any[];

      // Mapear las tareas del backend al formato TempTask
      const estadoMapFrontend: Record<number, TaskStatus> = {
        1: TaskStatus.TODO,
        2: TaskStatus.DOING,
        3: TaskStatus.REVISION,
        4: TaskStatus.DONE,
      };

      const tareasMapeadas: TempTask[] = tareasBackend.map((tarea) => ({
        id: tarea.id,
        name: tarea.titulo,
        description: tarea.descripcion,
        startDate: tarea.fechaInicio,
        estimatedDate: tarea.fechaFinEstimada,
        storyPoints: tarea.prioridad,
        status: tarea.estadoTareaId
          ? estadoMapFrontend[tarea.estadoTareaId] || TaskStatus.TODO
          : TaskStatus.TODO,
        projectId: tarea.proyectoId || 1,
        sprintId: tarea.sprintId || undefined,
        responsibleId: tarea.desarrolladorId || 0,
        userStoryId: tarea.historiaUsuarioId || 1,
      }));

      setTasks(tareasMapeadas);
      setHasLoaded(true);
      console.log('Tareas cargadas desde /tarea2:', tareasMapeadas);
    } catch (err: any) {
      console.error('Error al cargar tareas:', err);
      setError('Error al cargar las tareas desde el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTask = (newTask: TempTask) => {
    setTasks(prev => [...prev, newTask]);
    setIsAddModalOpen(false);
  };

  const handleContinue = () => {
    if (tasks.length === 0) {
      setError('Debes tener al menos una tarea para continuar');
      return;
    }
    onContinue(tasks);
  };

  const handleClose = () => {
    setTasks([]);
    setHasLoaded(false);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content modal-large modal-tasks-review" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📋 Revisa las Tareas Sugeridas</h2>
            <button className="modal-close-btn" onClick={handleClose}>×</button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner">⏳</div>
                <p>Cargando tareas...</p>
              </div>
            ) : (
              <>
                <p className="review-instruction">
                  Revisa, modifica o elimina las tareas antes de continuar con la planificación del sprint
                </p>

                <div className="tasks-table-container">
                  <table className="tasks-review-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Estimada</th>
                        <th>Story Points</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="empty-tasks">
                            <div className="empty-icon">📭</div>
                            <p>No hay tareas disponibles</p>
                            <p className="empty-hint">Agrega tareas para comenzar</p>
                          </td>
                        </tr>
                      ) : (
                        tasks.map((task, index) => (
                          <tr key={index}>
                            <td className="task-number">{index + 1}</td>
                            <td className="task-title">{task.name}</td>
                            <td className="task-desc">{task.description || 'Sin descripción'}</td>
                            <td className="task-date">
                              {task.startDate ? new Date(task.startDate).toLocaleDateString('es-ES') : 'N/A'}
                            </td>
                            <td className="task-date">
                              {new Date(task.estimatedDate).toLocaleDateString('es-ES')}
                            </td>
                            <td className="task-points">
                              <span className="points-badge">{task.storyPoints}</span>
                            </td>
                            <td className="task-actions">
                              <button
                                className="btn-icon btn-delete"
                                onClick={() => handleDeleteTask(index)}
                                title="Eliminar tarea"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="add-task-section">
                  <button
                    className="btn btn-outline btn-add-task"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    ➕ Agregar Tarea
                  </button>
                </div>

                <div className="tasks-summary">
                  <span className="summary-text">
                    Total de tareas: <strong>{tasks.length}</strong>
                  </span>
                  <span className="summary-text">
                    Story Points totales: <strong>{tasks.reduce((sum, t) => sum + t.storyPoints, 0)}</strong>
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button onClick={handleClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button
              onClick={handleContinue}
              className="btn btn-primary"
              disabled={loading || tasks.length === 0}
            >
              Continuar con Planificación →
            </button>
          </div>
        </div>
      </div>

      {/* Modal para agregar tareas */}
      <AddTaskToListModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTaskAdded={handleAddTask}
      />
    </>
  );
};

const SprintGenerator: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTasksReviewModalOpen, setIsTasksReviewModalOpen] = useState(false);
  const [isAssignmentBoardOpen, setIsAssignmentBoardOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [tempTasks, setTempTasks] = useState<TempTask[]>([]);

  const handleDownloadTemplate = () => {
    // Ruta al documento que subirás en tu proyecto
    // Coloca tu documento en la carpeta public, por ejemplo: public/templates/plantilla-sprint.docx
    const link = document.createElement('a');
    link.href = './docs/plantilla.txt'; // Ajusta la ruta según donde coloques el archivo
    link.download = 'plantilla.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewTemplate = () =>   {
    window.open('./docs/plantilla.txt', '_blank');
  };

  const handleStartPlanning = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileContinue = (file: File) => {
    setUploadedFile(file);
    setIsUploadModalOpen(false);
    
    // Aquí después conectarás con el siguiente modal
    console.log('Archivo subido:', file.name);
    setIsTasksReviewModalOpen(true);
    // TODO: Abrir el siguiente modal para procesar con IA
  };

  const handleTasksReviewContinue = (tasks: TempTask[]) => {
    setTempTasks(tasks);
    setIsTasksReviewModalOpen(false);
    
    console.log('Tareas finales para procesar:', tasks);
    // TODO: Aquí abrirás el siguiente modal
    // Abrir el tablero de asignación
    setIsAssignmentBoardOpen(true);
  };

  const handleAssignmentComplete = () => {
    setIsAssignmentBoardOpen(false);
    setTempTasks([]);
    setUploadedFile(null);
    // Aquí puedes agregar navegación o mostrar mensaje de éxito
  };

  return (
    <div className="sprint-generator-page">
      <div className="generator-container">
        {/* Header con animación */}
        <div className="generator-header">
          <div className="header-icon">🤖</div>
          <h1 className="generator-title">Planea tu Sprint con Ayuda de IA</h1>
          <p className="generator-subtitle">
            Deja que la inteligencia artificial te ayude a organizar y distribuir 
            las tareas de tu próximo sprint de manera eficiente
          </p>
        </div>

        {/* Cards de acciones */}
        <div className="actions-container">
          <div className="action-card">
            <div className="card-icon">📥</div>
            <h3>Descarga la Plantilla</h3>
            <p>
              Descarga nuestro documento de ejemplo para conocer el formato 
              recomendado para planificar tu sprint
            </p>
            <button 
              className="btn btn-outline"
              onClick={handleViewTemplate}
              onDoubleClick={handleDownloadTemplate}
            >
              📄 Descargar Plantilla
            </button>
          </div>

          <div className="action-card action-card-primary">
            <div className="card-icon">🚀</div>
            <h3>Comienza la Planificación</h3>
            <p>
              Sube tu documento con los requisitos y deja que la IA 
              te sugiera la mejor distribución de tareas
            </p>
            <button 
              className="btn btn-primary btn-start"
              onClick={handleStartPlanning}
            >
              ✨ Empezar
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-section">
          <h3>¿Cómo funciona?</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <p>Descarga y revisa la plantilla de ejemplo</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <p>Prepara tu documento con los requisitos del sprint</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <p>Sube el documento y la IA lo analizará</p>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <p>Recibe sugerencias inteligentes de planificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de subida */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onContinue={handleFileContinue}
      />

      {/* Modal de revisión de tareas */}
      <TasksReviewModal
        isOpen={isTasksReviewModalOpen}
        onClose={() => setIsTasksReviewModalOpen(false)}
        onContinue={handleTasksReviewContinue}
        uploadedFile={uploadedFile}
      />

      {/* Tablero de asignación de tareas */}
      <TaskAssignmentBoard
        isOpen={isAssignmentBoardOpen}
        onClose={handleAssignmentComplete}
        tasks={tempTasks}
      />
    </div>
  );
};

export default SprintGenerator;