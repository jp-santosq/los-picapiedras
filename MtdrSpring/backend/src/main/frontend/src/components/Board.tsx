import React, { useState } from "react";
import Canva from "./Canva.tsx";
import "../styles/components/board.css";
import { TaskDescription, Task } from "./TaskDescription.tsx";
import { TaskStatus } from "./enums.tsx";
import { useTasks } from "../context/TaskContext.tsx";

function Board() {
  const { tasks, updateTaskState } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function handleTaskClick(task: Task) {
    setSelectedTask(task);
  }

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

      {selectedTask && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} 
          >
            <button className="modal-close-btn" onClick={closeModal}>
              ×
            </button>
            <TaskDescription task={selectedTask} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Board;