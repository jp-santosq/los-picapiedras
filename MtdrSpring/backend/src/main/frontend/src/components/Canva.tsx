import React from "react";
import Task from "./Task.tsx";
import "../styles/components/canva.css";
import { useAuth } from "../context/AuthContext.tsx";

function Canva({ state, tasks, updateTaskState, onTaskClick }) {
  function handleOnDragOver(e) {
    e.preventDefault();
  }

  function handleOnDrop(e) {
    const taskId = Number(e.dataTransfer.getData("id"));
    if (taskId) {
      updateTaskState(taskId, state);
    }
  }

  return (
    <div
      className="canva-container"
      onDragOver={handleOnDragOver}
      onDrop={handleOnDrop}
    >
      
      {Array.isArray(tasks) &&
        tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            responsibleId={task.responsibleId}
            name={task.name}
            state={task.state}
            onClick={() => onTaskClick(task)}
          />
        ))}
    </div>
  );
}

export default Canva;
