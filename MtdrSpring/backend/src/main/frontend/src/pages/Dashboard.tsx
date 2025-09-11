import Board from "../components/Board.tsx";
import { TaskManager } from "../components/TaskManager.tsx";
import { TasksProvider } from "../context/TaskContext.tsx";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <TasksProvider>
        <TaskManager />
        <Board />
      </TasksProvider>
    </div>
  );
}

export default Dashboard;