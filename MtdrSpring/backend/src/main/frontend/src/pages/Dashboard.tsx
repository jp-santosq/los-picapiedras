import { useState } from "react";
import "../styles/components/dashboard.css";
import Board from "../components/Board.tsx";
import CreateTaskModal from "../components/CreateTaskModal.tsx";
import { TasksProvider } from "../context/TaskContext.tsx";

function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleTaskCreated = () => {
    console.log("✅ Tarea creada exitosamente (Dashboard)");
    setIsCreateModalOpen(false);
  };

  return (
    <TasksProvider>
      <div className="dashboard-container">
        <div className="dashboard-bar">
          <h2 className="dashboard-project-title">Proyecto: Los Picapiedras</h2>
          <h2 className="dashboard-kanban-title">TABLERO KANBAN</h2>
          <button
            className="dashboard-create-btn"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Crear Tarea
          </button>
        </div>

        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />

        <Board />
      </div>
    </TasksProvider>
  );
}

export default Dashboard;
