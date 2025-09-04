import React, { useState } from "react";
import Canva from "./Canva";
import "../styles/components/board.css"

function Board() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1", state: "to_do" },
    { id: 2, name: "Task 2", state: "doing" },
    { id: 3, name: "Task 3", state: "revision" },
    { id: 4, name: "Task 4", state: "done" },
    { id: 5, name: "Task 5", state: "to_do" },
    { id: 6, name: "Task 6", state: "doing" },
    { id: 7, name: "Task 7", state: "revision" },
    { id: 8, name: "Task 8", state: "done" },
    { id: 9, name: "Task 9", state: "to_do" },
    { id: 10, name: "Task 10", state: "doing" },
    { id: 11, name: "Task 11", state: "revision" },
    { id: 12, name: "Task 12", state: "done" },
  ]);

  function updateTaskState(taskId, newState) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, state: newState } : task
      )
    );
  }

  return (
    <div className="board-container">
      <Canva
        state="to_do"
        tasks={tasks.filter((t) => t.state === "to_do")}
        updateTaskState={updateTaskState}
      />
      <Canva
        state="doing"
        tasks={tasks.filter((t) => t.state === "doing")}
        updateTaskState={updateTaskState}
      />
      <Canva
        state="revision"
        tasks={tasks.filter((t) => t.state === "revision")}
        updateTaskState={updateTaskState}
      />
      <Canva
        state="done"
        tasks={tasks.filter((t) => t.state === "done")}
        updateTaskState={updateTaskState}
      />
    </div>
  );
}

export default Board;
