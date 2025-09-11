import React, { useState } from "react";
import Canva from "./Canva.tsx";
import "../styles/components/board.css";
import { TaskDescription, Task } from "./TaskDescription.tsx";
import { TaskStatus } from "./enums.tsx";
import mockTasks from "../mockData/mockTasks.json";

function Board() {
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.map((task) => ({
      ...task,
      status:
        task.status === "To Do"
          ? TaskStatus.TODO
          : task.status === "Doing"
          ? TaskStatus.DOING
          : task.status === "Revision"
          ? TaskStatus.REVISION
          : task.status === "Done"
          ? TaskStatus.DONE
          : TaskStatus.TODO,
    }))
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function updateTaskState(taskId: number, newState: TaskStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newState } : task
      )
    );
  }

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
            tasks={tasks.filter((t) => t.status === status)}
            updateTaskState={updateTaskState}
            onTaskClick={handleTaskClick}
          />
        ))}
      </div>

      {/* Modal */}
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
