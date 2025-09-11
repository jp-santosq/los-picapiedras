import React from "react";
import "../styles/components/task.css";

function Task({ id, name, state, onClick }) {
  function handleOnDrag(e) {
    e.dataTransfer.setData("id", id); // solo mandamos el id
  }

  return (
    <div
      className="task-container"
      draggable
      onDragStart={handleOnDrag}
      onClick={onClick}
    >
      <p>{name}</p>
      <small>{state}</small>
    </div>
  );
}

export default Task;
