import Board from "../components/Board.tsx";
import { TaskManager } from "../components/TaskManager.tsx";
import { TasksProvider } from "../context/TaskContext.tsx";
function Dashboard(){

  return (
    <>
    <TasksProvider>
      <TaskManager />
      <Board />
    </TasksProvider>
    </>
  );
}

export default Dashboard