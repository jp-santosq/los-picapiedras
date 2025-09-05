import React from "react";
import Task from "./Task.tsx";
import "../styles/components/canva.css";

function Canva({ state, tasks, updateTaskState }) {
  function handleOnDragOver(e) {
    e.preventDefault();
  }

  function handleOnDrop(e) {
    const taskId = Number(e.dataTransfer.getData("id"));
    if (taskId) {
      updateTaskState(taskId, state); // actualiza el estado de la tarea
    }
  }

  return (
    <div
      className="canva-container"
      onDragOver={handleOnDragOver}
      onDrop={handleOnDrop}
    >
      <h3>{state}</h3>
      {Array.isArray(tasks) &&
        tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            name={task.name}
            state={task.state}
          />
        ))}
    </div>
  );
}

export default Canva;
