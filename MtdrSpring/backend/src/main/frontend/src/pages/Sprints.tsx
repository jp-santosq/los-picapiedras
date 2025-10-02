import React from "react";
import SprintManager from "../components/SprintManager.tsx";

const Sprints: React.FC = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Sprints</h1>
      <SprintManager />
    </div>
  );
};

export default Sprints;
