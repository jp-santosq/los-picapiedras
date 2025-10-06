import React from "react";
import "../styles/components/sprintCard.css";

interface Sprint {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real?: string | null;
}

interface Props {
  sprint: Sprint;
}

const SprintCard: React.FC<Props> = ({ sprint }) => {
  return (
    <div className="sprint-card">
      <div className="sprint-info">
        <h3 className="sprint-title">{sprint.nombre}</h3>
        <p>Inicio: {sprint.fecha_inicio}</p>
        <p>Fin estimado: {sprint.fecha_fin_estimada}</p>
        {sprint.fecha_fin_real && <p>Finalizó: {sprint.fecha_fin_real}</p>}
      </div>
    </div>
  );
};

export default SprintCard;
