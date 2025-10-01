import React, { useState } from "react";
import mockSprints from "../mockData/mockSprints.json";

interface Sprint {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real?: string | null;
}

const Sprints: React.FC = () => {
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);

  const crearSprint = () => {
    const nuevoSprint: Sprint = {
      id: sprints.length + 1,
      nombre: `Sprint ${sprints.length + 1}`,
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_fin_estimada: new Date(
        new Date().setDate(new Date().getDate() + 14)
      ).toISOString().split("T")[0],
      fecha_fin_real: null,
    };
    setSprints([...sprints, nuevoSprint]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sprints</h1>
      <button onClick={crearSprint}>Crear Sprint</button>
      <ul>
        {sprints.map((sprint) => (
          <li key={sprint.id}>
            <strong>{sprint.nombre}</strong> <br />
            Inicio: {sprint.fecha_inicio} <br />
            Fin estimado: {sprint.fecha_fin_estimada} <br />
            {sprint.fecha_fin_real && <span>Finalizó: {sprint.fecha_fin_real}</span>}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sprints;