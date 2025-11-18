import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../context/TaskContext.tsx';
import { useSprints } from '../context/SprintContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useUsers } from '../context/UserContext.tsx';
import { ROL, TaskStatus } from '../components/enums.tsx';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import '../styles/components/kpis.css';

type SprintHours = {
  sprintId: number;
  sprintInicio?: string;
  sprintFin?: string;
  horas: number;
};

type SprintUserHours = SprintHours & {
  usuarioId: number;
  usuarioNombre: string;
};

const KPIs: React.FC = () => {
  const { tasks } = useTasks();
  const { sprints } = useSprints();
  const { user } = useAuth();
  const { users } = useUsers();
  
  const [activeTab, setActiveTab] = useState<'team' | 'developers'>('team');
  const [selectedDeveloper, setSelectedDeveloper] = useState<number | 'all'>('all');

  // --- NEW: Fetch Oracle KPI data ---
  const [estimadas, setEstimadas] = useState<SprintHours[]>([]);
  const [reales, setReales] = useState<SprintHours[]>([]);
  const [estimadasUsuarios, setEstimadasUsuarios] = useState<SprintUserHours[]>([]);
  const [realesUsuarios, setRealesUsuarios] = useState<SprintUserHours[]>([]);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        const [
          resEstimadas,
          resReales,
          resEstimadasUsuario,
          resRealesUsuario,
        ] = await Promise.all([
          fetch('/kpi/horas/estimadas/sprint'),
          fetch('/kpi/horas/reales/sprint'),
          fetch('/kpi/horas/estimadas/sprint-desarrollador'),
          fetch('/kpi/horas/reales/sprint-desarrollador'),
        ]);

        if (
          !resEstimadas.ok ||
          !resReales.ok ||
          !resEstimadasUsuario.ok ||
          !resRealesUsuario.ok
        ) {
          throw new Error('Failed to fetch KPI data');
        }

        const [
          dataEstimadas,
          dataReales,
          dataEstimadasUsuario,
          dataRealesUsuario,
        ] = await Promise.all([
          resEstimadas.json(),
          resReales.json(),
          resEstimadasUsuario.json(),
          resRealesUsuario.json(),
        ]);

        setEstimadas(dataEstimadas);
        setReales(dataReales);
        setEstimadasUsuarios(dataEstimadasUsuario);
        setRealesUsuarios(dataRealesUsuario);
      } catch (err) {
        console.error('Error fetching KPI data:', err);
      }
    };
    fetchKpiData();
  }, []);

  // Obtener datos de tareas completadas por sprint para el equipo
  const teamDataBySprint = useMemo(() => {
    const sprintMap = new Map<number, { completed: number, total: number }>();
    
    sprints.forEach(sprint => {
      const sprintTasks = tasks.filter(task => task.sprintId === sprint.id);
      const completedTasks = sprintTasks.filter(task => task.status === TaskStatus.DONE);
      
      sprintMap.set(sprint.id, {
        completed: completedTasks.length,
        total: sprintTasks.length
      });
    });

    return sprints
      .map(sprint => ({
        sprintId: sprint.id,
        sprintName: `Sprint #${sprint.id}`,
        completed: sprintMap.get(sprint.id)?.completed || 0,
        total: sprintMap.get(sprint.id)?.total || 0
      }))
      .sort((a, b) => a.sprintId - b.sprintId);
  }, [tasks, sprints]);

  // Obtener datos por desarrollador
  const developerDataBySprint = useMemo(() => {
    if (selectedDeveloper === 'all') return [];

    const sprintMap = new Map<number, { completed: number, total: number }>();
    
    sprints.forEach(sprint => {
      const developerTasks = tasks.filter(
        task => task.sprintId === sprint.id && task.responsibleId === selectedDeveloper
      );
      const completedTasks = developerTasks.filter(task => task.status === TaskStatus.DONE);
      
      sprintMap.set(sprint.id, {
        completed: completedTasks.length,
        total: developerTasks.length
      });
    });

    return sprints
      .map(sprint => ({
        sprintId: sprint.id,
        sprintName: `Sprint #${sprint.id}`,
        completed: sprintMap.get(sprint.id)?.completed || 0,
        total: sprintMap.get(sprint.id)?.total || 0
      }))
      .sort((a, b) => a.sprintId - b.sprintId);
  }, [tasks, sprints, selectedDeveloper]);

  // Estadísticas generales del equipo
  const teamStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.DOING).length;
    const todoTasks = tasks.filter(t => t.status === TaskStatus.TODO).length;
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      inProgress: inProgressTasks,
      todo: todoTasks,
      completionRate
    };
  }, [tasks]);

  // Estadísticas por desarrollador
  const developerStats = useMemo(() => {
    return users.map(developer => {
      const developerTasks = tasks.filter(t => t.responsibleId === developer.id);
      const completedTasks = developerTasks.filter(t => t.status === TaskStatus.DONE);
      const completionRate = developerTasks.length > 0 
        ? ((completedTasks.length / developerTasks.length) * 100).toFixed(1) 
        : 0;

      return {
        id: developer.id,
        name: developer.name,
        totalTasks: developerTasks.length,
        completedTasks: completedTasks.length,
        completionRate
      };
    }).sort((a, b) => b.completedTasks - a.completedTasks);
  }, [tasks, users]);

  const developerHoursBySprint = useMemo(() => {
    if (selectedDeveloper === 'all') return [];

    const estimadasPorSprint = estimadasUsuarios.filter(
      (item) => item.usuarioId === selectedDeveloper
    );
    const realesPorSprint = realesUsuarios.filter(
      (item) => item.usuarioId === selectedDeveloper
    );

    const sprintIds = new Set<number>([
      ...estimadasPorSprint.map((item) => item.sprintId),
      ...realesPorSprint.map((item) => item.sprintId),
    ]);

    return Array.from(sprintIds)
      .map((sprintId) => ({
        sprintId,
        sprintName: `Sprint #${sprintId}`,
        estimadas: estimadasPorSprint.find((item) => item.sprintId === sprintId)?.horas || 0,
        reales: realesPorSprint.find((item) => item.sprintId === sprintId)?.horas || 0,
      }))
      .sort((a, b) => a.sprintId - b.sprintId);
  }, [estimadasUsuarios, realesUsuarios, selectedDeveloper]);

  const selectedDeveloperStats = useMemo(() => {
    if (selectedDeveloper === 'all') return null;
    return developerStats.find((dev) => dev.id === selectedDeveloper) || null;
  }, [developerStats, selectedDeveloper]);
  const selectedDeveloperName = useMemo(() => {
    if (selectedDeveloper === 'all') return '';
    return users.find((u) => u.id === selectedDeveloper)?.name || '';
  }, [selectedDeveloper, users]);

  // Verificar si el usuario es administrador
  const isAdmin = user?.rol === ROL.ADMINISTRADOR;
  const isDeveloper = user?.rol === ROL.DESARROLLADOR;

  useEffect(() => {
    if (isDeveloper && user?.id && selectedDeveloper !== user.id) {
      setSelectedDeveloper(user.id);
    }
  }, [isDeveloper, user?.id, selectedDeveloper]);
  

  return (
    <div className="kpis-page">
      {/* Header */}
      <div className="kpis-header">
        <h1 className="kpis-title">KPIs y Métricas</h1>
        <p className="kpis-subtitle">
          Visualiza el progreso del equipo y desarrolladores individuales
        </p>
      </div>

      {/* Tabs */}
      <div className="kpis-tabs">
        <div className="tabs-container">
          <button
            onClick={() => setActiveTab('team')}
            className={`tab-button ${activeTab === 'team' ? 'active' : ''}`}
          >
            Equipo
          </button>
          <button
            onClick={() => setActiveTab('developers')}
            className={`tab-button ${activeTab === 'developers' ? 'active' : ''}`}
          >
            Desarrolladores
          </button>
        </div>
      </div>

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div>
          {/* Team Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-purple">
              <span className="stat-label">Total de Tareas</span>
              <span className="stat-value">{teamStats.total}</span>
            </div>
            <div className="stat-card stat-card-pink">
              <span className="stat-label">Completadas</span>
              <span className="stat-value">{teamStats.completed}</span>
            </div>
            <div className="stat-card stat-card-blue">
              <span className="stat-label">En Progreso</span>
              <span className="stat-value">{teamStats.inProgress}</span>
            </div>
            <div className="stat-card stat-card-green">
              <span className="stat-label">Tasa de Completitud</span>
              <span className="stat-value">{teamStats.completionRate}%</span>
            </div>
          </div>

          {/* NEW Oracle KPI Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Horas Estimadas vs Reales por Sprint</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="sprintId"
                  name="Sprint"
                  tick={{ fill: "#666" }}
                  label={{
                    value: "Sprint",
                    position: "insideBottom",
                    offset: 10,
                    fill: "#666",
                  }}
                />

                <YAxis name="Horas" tick={{ fill: "#666" }}>
                  <Label
                    value="Horas (estimadas/reales)"
                    angle={-90}
                    position="left"
                    fill="#4b5563"
                    offset={0}
                    style={{ textAnchor: 'middle' }}
                  />
                </YAxis>
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    value,
                    name === "horas" ? "Horas" : name,
                  ]}
                />
                <Legend />
                <Scatter
                  name="Horas Estimadas"
                  data={estimadas}
                  fill="#3b82f6"
                  line
                  dataKey="horas"
                />
                <Scatter
                  name="Horas Reales"
                  data={reales}
                  fill="#10b981"
                  line
                  dataKey="horas"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Developers Tab */}
      {activeTab === 'developers' && (
        <div>
          {/* Developer Filter - solo para admin */}
          {isAdmin && (
            <div className="developer-filter">
              <label htmlFor="developer-select">Seleccionar Desarrollador:</label>
              <select
                id="developer-select"
                value={selectedDeveloper}
                onChange={(e) =>
                  setSelectedDeveloper(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="developer-select"
              >
                <option value="all">-- Selecciona un desarrollador --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedDeveloper === 'all' ? (
            /* Developer Stats Table */
            <div className="developer-stats-container">
              <h3 className="developer-stats-title">Rendimiento por Desarrollador</h3>
              <table className="developer-stats-table">
                <thead>
                  <tr>
                    <th>Desarrollador</th>
                    <th>Total Tareas</th>
                    <th>Completadas</th>
                    <th>Tasa de Completitud</th>
                  </tr>
                </thead>
                <tbody>
                  {developerStats.map((dev) => (
                    <tr key={dev.id}>
                      <td className="developer-name">{dev.name}</td>
                      <td className="developer-total">{dev.totalTasks}</td>
                      <td className="developer-completed">{dev.completedTasks}</td>
                      <td className="developer-rate">
                        <span
                          className={`completion-badge ${
                            Number(dev.completionRate) >= 70
                              ? 'completion-badge-high'
                              : Number(dev.completionRate) >= 40
                              ? 'completion-badge-medium'
                              : 'completion-badge-low'
                          }`}
                        >
                          {dev.completionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              {selectedDeveloperStats && (
                <div className="stats-grid developer-summary">
                  <div className="stat-card stat-card-purple">
                    <span className="stat-label">Total de Tareas</span>
                    <span className="stat-value">{selectedDeveloperStats.totalTasks}</span>
                  </div>
                  <div className="stat-card stat-card-green">
                    <span className="stat-label">Tareas Completadas</span>
                    <span className="stat-value">{selectedDeveloperStats.completedTasks}</span>
                  </div>
                  <div className="stat-card stat-card-blue">
                    <span className="stat-label">Pendientes</span>
                    <span className="stat-value">
                      {selectedDeveloperStats.totalTasks - selectedDeveloperStats.completedTasks}
                    </span>
                  </div>
                  <div className="stat-card stat-card-pink">
                    <span className="stat-label">Tasa de Completitud</span>
                    <span className="stat-value">{selectedDeveloperStats.completionRate}%</span>
                  </div>
                </div>
              )}

              {/* Developer hours chart */}
              <div className="chart-container">
                <h3 className="chart-title">
                  Horas Estimadas vs Reales - {selectedDeveloperName}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="sprintId"
                      name="Sprint"
                      tick={{ fill: '#666' }}
                      label={{ value: 'Sprint', position: 'insideBottom', offset: 10, fill: '#666' }}
                    />
                    <YAxis name="Horas" tick={{ fill: '#666' }}>
                      <Label
                        value="Horas (estimadas/reales)"
                        angle={-90}
                        position="left"
                        fill="#4b5563"
                        offset={0}
                        style={{ textAnchor: 'middle' }}
                      />
                    </YAxis>
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value: number, name: string) => [
                        value,
                        name === 'estimadas' ? 'Horas Estimadas' : 'Horas Reales',
                      ]}
                    />
                    <Legend />
                    <Scatter
                      name="Horas Estimadas"
                      data={developerHoursBySprint}
                      dataKey="estimadas"
                      fill="#3b82f6"
                      line
                    />
                    <Scatter
                      name="Horas Reales"
                      data={developerHoursBySprint}
                      dataKey="reales"
                      fill="#10b981"
                      line
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Developer completed tasks chart */}
              <div className="chart-container">
                <h3 className="chart-title">
                  Tareas Completadas - {selectedDeveloperName}
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 30, left: 80, bottom: 0 }}>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="sprintId"
                      name="Sprint"
                      tick={{ fill: '#666' }}
                      label={{ value: 'Sprint', position: 'insideBottom', offset: -0.001, fill: '#666' }}
                    />
                    <YAxis name="Tareas" tick={{ fill: '#666' }}>
                      <Label
                        value="Tareas Completadas"
                        angle={-90}
                        position="left"
                        fill="#4b5563"
                        offset={0}
                        style={{ textAnchor: 'middle' }}
                      />
                    </YAxis>
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      formatter={(value: number, name: string) =>
                        [value, name === 'completed' ? 'Completadas' : name]
                      }
                    />
                    <Legend />
                    <Scatter
                      name="Completadas"
                      data={developerDataBySprint}
                      dataKey="completed"
                      fill="#8b5cf6"
                      line
                      lineType="joint"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default KPIs;
