import "../styles/components/taskDescription.css";
import { Task } from "../context/TaskContext.tsx";

interface TaskDescriptionProps {
  task: Task;
}

export function TaskDescription({ task }: TaskDescriptionProps) {
  return (
    <div className="task-container">
      <h2 className="task-title">{task.name}</h2>
      <p><strong>Fecha estimada:</strong> {task.estimatedDate}</p>
      <p><strong>Story Points:</strong> {task.storyPoints}</p>
      <p><strong>Descripción:</strong> {task.description}</p>
      <p>
        <strong>Estado:</strong>{" "}
        <span className={`status-${task.status.toLowerCase().replace(" ", "-")}`}>
          {task.status}
        </span>
      </p>
    </div>
  );
}
