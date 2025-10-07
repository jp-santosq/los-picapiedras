import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import TaskDetailsModal from '../components/TaskDetailsModal.tsx';
import CreateTaskModal from '../components/CreateTaskModal.tsx';
import '../styles/components/tasks.css';
import { TaskStatus } from '../components/enums.tsx';

const Tasks: React.FC = () => {
  const { tasks } = useTasks();
  const { sprints } = useSprints();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsDetailsModalOpen(true);
  };

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.responsible.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSprint = selectedSprintFilter === 'all';
      
      return matchesSearch && matchesSprint;
    });
  }, [tasks, searchTerm, selectedSprintFilter]);

  const selectedTask = selectedTaskId 
    ? tasks.find(t => t.id === selectedTaskId) || null
    : null;

  // Estadísticas
  const stats = useMemo(() => ({
    total: tasks.length,
    todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
    doing: tasks.filter(t => t.status === TaskStatus.DOING).length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
  }), [tasks]);

  // Función para manejar cuando se crea una tarea
  const handleTaskCreated = () => {
    // La recarga se maneja automáticamente en el TaskContext
    // Aquí puedes agregar lógica adicional si necesitas
    console.log('Tarea creada exitosamente');
  };

  return (
    <div className="tasks-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Gestión de Tareas</h1>
          <p className="page-subtitle">
            Administra y visualiza todas las tareas del proyecto
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
            placeholder="Buscar por nombre o responsable..."
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
                  <th>Proyecto</th>
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
                    <td className="task-responsible">{task.responsible}</td>
                    <td className="task-project">{/*task.project*/}Oracle Java Bot</td>
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