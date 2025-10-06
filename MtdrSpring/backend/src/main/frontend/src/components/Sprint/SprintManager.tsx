import React, { useState } from "react";
import "../styles/components/taskManager.css"; 
import mockSprints from "../../mockData/mockSprints.json";
import SprintCard from "./SprintCard.tsx";

interface Sprint {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real?: string | null;
}

export function SprintManager() {
  const [sprints, setSprints] = useState<Sprint[]>(mockSprints);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSprint, setNewSprint] = useState({
    nombre: "",
    fecha_inicio: "",
    fecha_fin_estimada: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewSprint((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const sprint: Sprint = {
      id: sprints.length + 1,
      nombre: newSprint.nombre,
      fecha_inicio: newSprint.fecha_inicio,
      fecha_fin_estimada: newSprint.fecha_fin_estimada,
      fecha_fin_real: null,
    };

    setSprints([...sprints, sprint]);
    setIsModalOpen(false);

    // reset form
    setNewSprint({
      nombre: "",
      fecha_inicio: "",
      fecha_fin_estimada: "",
    });
  }

  return (
    <div className="task-manager">
      <div className="task-bar">
        <button className="create-task-btn" onClick={() => setIsModalOpen(true)}>
          + Crear Sprint
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Crear Nuevo Sprint</h3>
            <form onSubmit={handleSubmit} className="task-form">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del sprint"
                value={newSprint.nombre}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="fecha_inicio"
                value={newSprint.fecha_inicio}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="fecha_fin_estimada"
                value={newSprint.fecha_fin_estimada}
                onChange={handleChange}
                required
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Guardar
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de sprints */}
      <div className="sprint-list">
        {sprints.map((sprint) => (
          <SprintCard key={sprint.id} sprint={sprint} />
        ))}
      </div>
    </div>
  );
}

export default SprintManager;
