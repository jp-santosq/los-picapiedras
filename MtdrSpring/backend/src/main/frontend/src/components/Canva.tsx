import React from "react";
import Task from "./Task.tsx";
import "../styles/components/canva.css";
import { useAuth } from "../context/AuthContext.tsx";

function Canva({ state, tasks, updateTaskState, onTaskClick }) {
  const { user } = useAuth();
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
      <h3>{state}</h3>
      {Array.isArray(tasks) &&
        tasks
          .filter((task) => {
            console.log("Comparando", task.responsibleId, user?.id);
            return user && Number(task.responsibleId) === Number(user.id);
          })
          .map((task) => (
            <Task
              key={task.id}
              id={task.id}
              responsibleId={task.responsibleId}
              name={task.name}
              state=""
              onClick={() => onTaskClick(task)}
            />
          ))}
    </div>
  );
}

export default Canva;
