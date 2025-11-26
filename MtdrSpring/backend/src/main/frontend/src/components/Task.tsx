import React from "react";
import "../styles/components/task.css";

function Task({ id ,responsibleId, name, state, onClick }) {
  function handleOnDrag(e) {
    e.dataTransfer.setData("id", id);
  }

  return (
    <div
      className="task-container"
      draggable
      onDragStart={handleOnDrag}
      onClick={onClick}
    >
      <div className="task-header">
        <span className="task-id">#{id}</span>
        <p className="task-name">{name}</p>
      </div>
    </div>
  );
}

export default Task;
