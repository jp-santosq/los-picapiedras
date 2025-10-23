import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth, User } from '../context/AuthContext.tsx';
import { useUsers } from '../context/UserContext.tsx';
import TaskDetailsModal from '../components/TaskDetailsModal.tsx';
import CreateTaskModal from '../components/CreateTaskModal.tsx';
import '../styles/components/tasks.css';
import { TaskStatus } from '../components/enums.tsx';

const Tasks: React.FC = () => {
  const { tasks, refreshTasks } = useTasks();
  const { sprints } = useSprints();
  const { user } = useAuth();
  const { users, getUserById, refreshUsers } = useUsers();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔹 Usar ref para evitar recrear listeners
  const hasLoadedData = useRef(false);

  // Determinar si el usuario es administrador
  const isAdmin = user?.rol === 2;

  // 🔹 Cargar datos iniciales (usuarios + tareas)
  useEffect(() => {
    if (hasLoadedData.current) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([refreshTasks(), refreshUsers()]);
        hasLoadedData.current = true;
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Auto-refresh cuando la página se vuelve visible
  useEffect(() => {
    const handleFocus = () => {
      if (refreshTasks) refreshTasks();
    };
    const handleVisibilityChange = () => {
      if (!document.hidden && refreshTasks) refreshTasks();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsDetailsModalOpen(true);
  };

  // Filtrar tareas según el rol y modo de vista
  const displayTasks = useMemo(() => {
    if (!user) return [];
    if (isAdmin) return tasks; // Si es administrador, mostrar todas las tareas
    return tasks.filter(task => task.responsibleId === user.id); //mostrar solo tareas del usuario
  }, [tasks, user, isAdmin]);

  // Filtrar tareas por búsqueda y sprint
  const filteredTasks = useMemo(() => {
    return displayTasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSprint = selectedSprintFilter === 'all' ||  
                           (task.sprintId !== null && task.sprintId !== undefined && 
                            task.sprintId.toString() === selectedSprintFilter);
      
      return matchesSearch && matchesSprint;
    });
  }, [displayTasks, searchTerm, selectedSprintFilter]);

  const selectedTask = selectedTaskId 
    ? tasks.find(t => t.id === selectedTaskId) || null
    : null;

  
  // Estadísticas según el modo de vista
  const stats = useMemo(() => ({
    total: displayTasks.length,
    todo: displayTasks.filter(t => t.status === TaskStatus.TODO).length,
    doing: displayTasks.filter(t => t.status === TaskStatus.DOING).length,
    revision: displayTasks.filter(t => t.status === TaskStatus.REVISION).length,
    done: displayTasks.filter(t => t.status === TaskStatus.DONE).length,
  }), [displayTasks]);


  // Función para obtener el nombre del responsable
  const getResponsibleName = (responsibleId: number | null | undefined): string => {
    if (!responsibleId) return 'Sin asignar';
    const responsible: User | undefined = getUserById(responsibleId);
    console.log("Responsable encontrado:", responsibleId, responsible?.name);
    return responsible?.name || 'Desconocido';
  };


  // Función para manejar cuando se crea una tarea
  const handleTaskCreated = () => {
    // La recarga se maneja automáticamente en el TaskContext
    console.log('Tarea creada exitosamente');
  };
  
  // 🔸 Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-icon">⏳</div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Tareas</h1>
          <p className="page-subtitle">
            {isAdmin 
              ? 'Administra y visualiza todas las tareas del proyecto'
              : `Tareas asignadas a ${user?.name || 'ti'}`
            }
          </p>
        </div>
        <button
          className="btn btn-primary btn-create"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + Crear Tarea
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card stat-todo">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <span className="stat-value">{stats.todo}</span>
            <span className="stat-label">Por Hacer</span>
          </div>
        </div>
        <div className="stat-card stat-doing">
          <div className="stat-icon">⚙️</div>
          <div className="stat-content">
            <span className="stat-value">{stats.doing}</span>
            <span className="stat-label">En Progreso</span>
          </div>
        </div>
        <div className="stat-card stat-revision">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <span className="stat-value">{stats.revision}</span>
            <span className="stat-label">En Revisión</span>
          </div>
        </div>
        <div className="stat-card stat-done">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <span className="stat-value">{stats.done}</span>
            <span className="stat-label">Completadas</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="sprint-filter">Filtrar por Sprint:</label>
          <select
            id="sprint-filter"
            value={selectedSprintFilter}
            onChange={(e) => setSelectedSprintFilter(e.target.value)}
            className="sprint-select"
          >
            <option value="all">Todos los sprints</option>
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>
                Sprint #{sprint.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="tasks-content">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No hay tareas disponibles</h3>
            <p>
              {searchTerm
                ? 'No se encontraron tareas con los filtros aplicados'
                : 'Comienza creando tu primera tarea'}
            </p>
            {!searchTerm && (
              <button
                className="btn btn-primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Crear Tarea
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Responsable</th>
                  <th>Sprint</th>
                  <th>Estado</th>
                  <th>Fecha Estimada</th>
                  <th>Story Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr 
                    key={task.id} 
                    onClick={() => handleTaskClick(task.id)}
                    className="task-row"
                  >
                    <td className="task-id">#{task.id}</td>
                    <td className="task-name">{task.name}</td>
                    <td className="task-responsible">{getResponsibleName(task.responsibleId)}</td>
                    <td className="task-sprint">{task.sprintId ? `#${task.sprintId}` : 'Sin Sprint'}</td>
                    <td>
                      <span className={`status-badge status-${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="task-date">
                      {new Date(task.estimatedDate).toLocaleDateString('es-ES')}
                    </td>
                    <td className="task-points">{task.storyPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedTaskId(null);
        }}
        task={selectedTask}
      />
    </div>
  );
};

export default Tasks;