import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TempTask } from '../pages/SprintGenerator.tsx';
import { useTasks } from '../context/TaskContext.tsx';
import '../styles/components/taskAssignmentBoard.css';

interface TeamMember {
  id: number;
  idUsuario: number;
  idProyecto: number;
  usuario: {
    id: number;
    nombreUsuario: string;
    correo: string;
    rol: {
      id: number;
    };
  };
  proyecto: {
    id: number;
    nombreProyecto: string;
  };
  idUsuarioProyecto: number;
}

interface TaskAssignment {
  [memberId: number]: TempTask[];
}

interface TaskAssignmentBoardProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TempTask[];
}

const TaskAssignmentBoard: React.FC<TaskAssignmentBoardProps> = ({
  isOpen,
  onClose,
  tasks: initialTasks
}) => {
  const { addTask } = useTasks();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment>({});
  const [unassignedTasks, setUnassignedTasks] = useState<TempTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<{ task: TempTask; fromMemberId: number | null } | null>(null);
  const [autoAssignedCount, setAutoAssignedCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchTeamMembers();
      setUnassignedTasks([...initialTasks]);
    }
  }, [isOpen, initialTasks]);

  // Nuevo efecto: Asignar tareas automáticamente cuando se cargan los miembros
  useEffect(() => {
    if (teamMembers.length > 0 && initialTasks.length > 0) {
      autoAssignTasks();
    }
  }, [teamMembers, initialTasks]);

  const autoAssignTasks = () => {
    const assigned: TaskAssignment = {};
    const unassigned: TempTask[] = [];
    let autoAssigned = 0;

    // Inicializar arrays para cada miembro
    teamMembers.forEach(member => {
      assigned[member.usuario.id] = [];
    });

    // Clasificar tareas según si tienen responsibleId
    initialTasks.forEach(task => {
      if (task.responsibleId && task.responsibleId !== 0) {
        // Verificar que el responsable exista en el equipo
        const memberExists = teamMembers.some(m => m.usuario.id === task.responsibleId);
        
        if (memberExists) {
          // Asignar a su columna correspondiente
          assigned[task.responsibleId].push(task);
          autoAssigned++;
          console.log(`Tarea "${task.name}" auto-asignada a usuario ${task.responsibleId}`);
        } else {
          // Si el responsable no está en el equipo, va a sin asignar
          unassigned.push(task);
          console.warn(`Tarea "${task.name}" tiene responsibleId ${task.responsibleId} pero no está en el equipo`);
        }
      } else {
        // Sin responsable, va a tareas sin asignar
        unassigned.push(task);
      }
    });

    setTaskAssignments(assigned);
    setUnassignedTasks(unassigned);
    setAutoAssignedCount(autoAssigned);
    
    console.log('Asignación automática completada:', {
      asignadas: autoAssigned,
      sinAsignar: unassigned.length
    });
  };

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Obtener el proyectoId del contexto o estado global
      const proyectoId = 1; // Por ahora hardcodeado, cambiar por el ID real del proyecto
      
      const response = await axios.get(`/usuarioProyecto/proyecto/${proyectoId}`);
      const members: TeamMember[] = response.data;
      
      setTeamMembers(members);
      
      console.log('Miembros del equipo cargados:', members);
    } catch (err) {
      console.error('Error al cargar miembros del equipo:', err);
      setError('Error al cargar los miembros del equipo');
    } finally {
      setLoading(false);
    }
  };

  // Funciones de Drag and Drop
  const handleDragStart = (task: TempTask, fromMemberId: number | null) => {
    setDraggedTask({ task, fromMemberId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetMemberId: number | null) => {
    if (!draggedTask) return;

    const { task, fromMemberId } = draggedTask;

    // Remover la tarea del origen
    if (fromMemberId === null) {
      // Viene de tareas sin asignar
      setUnassignedTasks(prev => prev.filter(t => t !== task));
    } else {
      // Viene de otro miembro
      setTaskAssignments(prev => ({
        ...prev,
        [fromMemberId]: prev[fromMemberId].filter(t => t !== task)
      }));
    }

    // Agregar la tarea al destino
    if (targetMemberId === null) {
      // Va a tareas sin asignar
      setUnassignedTasks(prev => [...prev, task]);
    } else {
      // Va a un miembro
      setTaskAssignments(prev => ({
        ...prev,
        [targetMemberId]: [...(prev[targetMemberId] || []), task]
      }));
    }

    setDraggedTask(null);
  };

  const handleConfirm = async () => {
    setSaving(true);
    setError(null);

    try {
      // Verificar que todas las tareas estén asignadas
      if (unassignedTasks.length > 0) {
        setError('Debes asignar todas las tareas antes de confirmar');
        setSaving(false);
        return;
      }

      // Crear todas las tareas en la base de datos
      const promises: Promise<void>[] = [];

      Object.entries(taskAssignments).forEach(([memberId, tasks]) => {
        tasks.forEach(task => {
          const taskWithResponsible = {
            ...task,
            responsibleId: parseInt(memberId)
          };
          promises.push(addTask(taskWithResponsible));
        });
      });

      await Promise.all(promises);

      console.log('Todas las tareas fueron creadas exitosamente');
      
      // Cerrar el modal
      onClose();
      
      // Mostrar mensaje de éxito (puedes usar un toast o snackbar aquí)
      alert('¡Sprint planificado exitosamente! Todas las tareas han sido asignadas.');
      
    } catch (err) {
      console.error('Error al guardar las tareas:', err);
      setError('Error al guardar las tareas en la base de datos');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setTeamMembers([]);
    setTaskAssignments({});
    setUnassignedTasks([]);
    setAutoAssignedCount(0);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-board" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>🎯 Asigna Tareas al Equipo</h2>
            <p className="board-subtitle">Arrastra las tareas para asignarlas a cada miembro del equipo</p>
          </div>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body board-modal-body">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">⏳</div>
              <p>Cargando miembros del equipo...</p>
            </div>
          ) : (
            <div className="board-container">
              {/* Columna de tareas sin asignar */}
              <div 
                className="board-column unassigned-column"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(null)}
              >
                <div className="column-header">
                  <h3>📋 Sin Asignar</h3>
                  <span className="task-count">{unassignedTasks.length}</span>
                </div>
                <div className="tasks-container">
                  {unassignedTasks.map((task, index) => (
                    <div
                      key={`unassigned-${index}`}
                      className="task-card"
                      draggable
                      onDragStart={() => handleDragStart(task, null)}
                    >
                      <div className="task-card-header">
                        <span className="task-card-title">{task.name}</span>
                        <span className="task-card-points">{task.storyPoints} pts</span>
                      </div>
                      {task.description && (
                        <p className="task-card-desc">{task.description}</p>
                      )}
                      <div className="task-card-footer">
                        <span className="task-card-date">
                          📅 {new Date(task.estimatedDate).toLocaleDateString('es-ES', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {unassignedTasks.length === 0 && (
                    <div className="empty-column">
                      <p>✅ Todas las tareas asignadas</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Columnas de miembros del equipo */}
              {teamMembers.map(member => (
                <div
                  key={member.usuario.id}
                  className="board-column member-column"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(member.usuario.id)}
                >
                  <div className="column-header member-header">
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.usuario.nombreUsuario.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>{member.usuario.nombreUsuario}</h3>
                        <span className="member-email">{member.usuario.correo}</span>
                      </div>
                    </div>
                    <span className="task-count">
                      {taskAssignments[member.usuario.id]?.length || 0}
                    </span>
                  </div>
                  <div className="tasks-container">
                    {(taskAssignments[member.usuario.id] || []).map((task, index) => (
                      <div
                        key={`member-${member.usuario.id}-${index}`}
                        className="task-card"
                        draggable
                        onDragStart={() => handleDragStart(task, member.usuario.id)}
                      >
                        <div className="task-card-header">
                          <span className="task-card-title">{task.name}</span>
                          <span className="task-card-points">{task.storyPoints} pts</span>
                        </div>
                        {task.description && (
                          <p className="task-card-desc">{task.description}</p>
                        )}
                        <div className="task-card-footer">
                          <span className="task-card-date">
                            📅 {new Date(task.estimatedDate).toLocaleDateString('es-ES', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                    {(taskAssignments[member.usuario.id]?.length === 0 || !taskAssignments[member.usuario.id]) && (
                      <div className="empty-column">
                        <p>Arrastra tareas aquí</p>
                      </div>
                    )}
                  </div>
                  {/* Story points totales del miembro */}
                  <div className="column-footer">
                    <span className="total-points">
                      Total: {(taskAssignments[member.usuario.id] || []).reduce((sum, t) => sum + t.storyPoints, 0)} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer board-footer">
          <div className="footer-info">
            <span>
              Tareas sin asignar: <strong>{unassignedTasks.length}</strong>
            </span>
            <span>
              Tareas totales: <strong>{initialTasks.length}</strong>
            </span>
          </div>
          <div className="footer-actions">
            <button 
              onClick={handleClose} 
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary btn-confirm"
              disabled={saving || unassignedTasks.length > 0}
            >
              {saving ? 'Guardando...' : '✅ Confirmar Asignaciones'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentBoard;