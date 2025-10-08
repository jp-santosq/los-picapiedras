import React, { useState } from "react";
import Canva from "./Canva.tsx";
import "../styles/components/board.css";
import { TaskDescription, Task } from "./TaskDescription.tsx";
import { TaskStatus } from "./enums.tsx";
import { useTasks } from "../context/TaskContext.tsx";
import TaskReadOnlyModal from './TaskReadOnlyModal.tsx';

function Board() {
  const { tasks, updateTaskState } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  function closeModal() {
    setSelectedTask(null);
  }

  const columns = [
    TaskStatus.TODO,
    TaskStatus.DOING,
    TaskStatus.REVISION,
    TaskStatus.DONE,
  ];

  return (
    <div className="board-container">
      <div className="board-columns">
        {columns.map((status) => (
          <Canva
            key={status}
            state={status}
            tasks={tasks.filter((t) => 
              t.status === status
            )}
            updateTaskState={updateTaskState}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {/* Modal de Tarea (Solo Lectura) */}
      <TaskReadOnlyModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={selectedTask}
      />
    </div>
  );
}

export default Board;