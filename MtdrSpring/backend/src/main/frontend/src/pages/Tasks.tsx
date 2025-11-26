import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth, User } from '../context/AuthContext.tsx';
import { useUsers } from '../context/UserContext.tsx';
import TaskDetailsModal from '../components/TaskDetailsModal.tsx';
import CreateTaskModal from '../components/CreateTaskModal.tsx';
import ReplayIcon from '@mui/icons-material/Replay';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl, InputLabel, Select, MenuItem, ListItemText } from '@mui/material';
import '../styles/components/tasks.css';
import { ROL, TaskStatus } from '../components/enums.tsx';

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
  const isAdmin = user?.rol === ROL.ADMINISTRADOR;

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
      <div className="tasks-page loading-wrapper">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <section className="page-hero">
        <div className="hero-text">
          <p className="hero-eyebrow">Panel operativo</p>
          <h1 className="page-title">Gestión de Tareas</h1>
          <p className="page-subtitle">
            {isAdmin
              ? 'Administra y visualiza todas las tareas del proyecto'
              : `Tareas asignadas a ${user?.name || 'ti'}`}
          </p>
        </div>
        <div className="hero-actions">
          <button
            className="btn btn-primary hero-refresh"
            onClick={refreshTasks}
            aria-label="Actualizar tareas"
            title="Actualizar tareas"
          >
            <ReplayIcon className="refresh-icon" fontSize="small" />
          </button>
          <button
            className="btn btn-primary hero-create"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Crear Tarea
          </button>
        </div>
      </section>

      <div className="stats-panel">
        <div className="stat-card accent-total">
          <p className="stat-label">Total de tareas</p>
          <p className="stat-value">{stats.total}</p>
          <span className="stat-footnote">Registro global</span>
        </div>
        <div className="stat-card accent-todo">
          <p className="stat-label">Por hacer</p>
          <p className="stat-value">{stats.todo}</p>
          <span className="stat-footnote">Pendientes de inicio</span>
        </div>
        <div className="stat-card accent-doing">
          <p className="stat-label">En progreso</p>
          <p className="stat-value">{stats.doing}</p>
          <span className="stat-footnote">Actualmente activas</span>
        </div>
        <div className="stat-card accent-revision">
          <p className="stat-label">En revisión</p>
          <p className="stat-value">{stats.revision}</p>
          <span className="stat-footnote">A la espera de aprobación</span>
        </div>
        <div className="stat-card accent-done">
          <p className="stat-label">Completadas</p>
          <p className="stat-value">{stats.done}</p>
          <span className="stat-footnote">Cerradas correctamente</span>
        </div>
      </div>

      <div className="filters-panel">
        <div className="search-group">
          <label htmlFor="task-search">Buscar tarea</label>
          <input
            id="task-search"
            type="text"
            placeholder="Nombre de la tarea"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="select-group">
          <label htmlFor="sprint-filter">Sprint</label>
          <FormControl size="small" className="sprint-formcontrol">
            <Select
              labelId="sprint-filter-label"
              id="sprint-filter"
              variant="outlined"
              value={selectedSprintFilter}
              label="Sprint"
              onChange={(e) => setSelectedSprintFilter(e.target.value as string)}
              renderValue={(val) => {
                if (val === 'all') return 'Todos los sprints';
                const s = sprints.find(s => s.id.toString() === val);
                return s ? `Sprint #${s.id}` : val;
              }}
              IconComponent={() => <KeyboardArrowDownIcon fontSize="small" />}
            >
              <MenuItem value="all" className="sprint-menuitem">Todos los sprints</MenuItem>
              {sprints.map(sprint => (
                <MenuItem key={sprint.id} value={sprint.id.toString()} className="sprint-menuitem">
                  <ListItemText primary={`Sprint #${sprint.id}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="tasks-content">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-graphic" aria-hidden="true"></div>
            <h3>Sin tareas registradas</h3>
            <p className="empty-text">
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
