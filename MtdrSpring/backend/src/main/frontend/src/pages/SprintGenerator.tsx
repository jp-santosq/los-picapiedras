import React, { useState } from 'react';
import '../styles/components/sprintGenerator.css';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (file: File) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleContinue = () => {
    if (selectedFile) {
      onContinue(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-upload" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📄 Sube tu documento</h2>
          <button className="modal-close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="upload-instruction">
            Sube el documento con los requisitos de tu sprint para que la IA te ayude a planificarlo
          </p>

          <div
            className={`upload-zone ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'file-selected' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="file-info">
                <div className="file-icon">📎</div>
                <div className="file-details">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">📁</div>
                <p className="upload-text">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="upload-hint">
                  Formatos aceptados: .doc, .docx, .txt
                </p>
              </>
            )}
            <input
              type="file"
              id="file-upload"
              className="file-input"
              accept=".doc,.docx,.txt"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            onClick={handleContinue}
            className="btn btn-primary"
            disabled={!selectedFile}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
};

const SprintGenerator: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    // Ruta al documento que subirás en tu proyecto
    // Coloca tu documento en la carpeta public, por ejemplo: public/templates/plantilla-sprint.docx
    const link = document.createElement('a');
    link.href = './docs/plantilla.txt'; // Ajusta la ruta según donde coloques el archivo
    link.download = 'plantilla.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewTemplate = () =>   {
    window.open('/templates/plantilla-sprint.docx', '_blank');
  };

  const handleStartPlanning = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileContinue = (file: File) => {
    setUploadedFile(file);
    setIsUploadModalOpen(false);
    
    // Aquí después conectarás con el siguiente modal
    console.log('Archivo subido:', file.name);
    // TODO: Abrir el siguiente modal para procesar con IA
  };

  return (
    <div className="sprint-generator-page">
      <div className="generator-container">
        {/* Header con animación */}
        <div className="generator-header">
          <div className="header-icon">🤖</div>
          <h1 className="generator-title">Planea tu Sprint con Ayuda de IA</h1>
          <p className="generator-subtitle">
            Deja que la inteligencia artificial te ayude a organizar y distribuir 
            las tareas de tu próximo sprint de manera eficiente
          </p>
        </div>

        {/* Cards de acciones */}
        <div className="actions-container">
          <div className="action-card">
            <div className="card-icon">📥</div>
            <h3>Descarga la Plantilla</h3>
            <p>
              Descarga nuestro documento de ejemplo para conocer el formato 
              recomendado para planificar tu sprint
            </p>
            <button 
              className="btn btn-outline"
              onClick={handleViewTemplate}
              onDoubleClick={handleDownloadTemplate}
            >
              📄 Descargar Plantilla
            </button>
          </div>

          <div className="action-card action-card-primary">
            <div className="card-icon">🚀</div>
            <h3>Comienza la Planificación</h3>
            <p>
              Sube tu documento con los requisitos y deja que la IA 
              te sugiera la mejor distribución de tareas
            </p>
            <button 
              className="btn btn-primary btn-start"
              onClick={handleStartPlanning}
            >
              ✨ Empezar
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="info-section">
          <h3>¿Cómo funciona?</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <p>Descarga y revisa la plantilla de ejemplo</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <p>Prepara tu documento con los requisitos del sprint</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <p>Sube el documento y la IA lo analizará</p>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <p>Recibe sugerencias inteligentes de planificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de subida */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onContinue={handleFileContinue}
      />
    </div>
  );
};

export default SprintGenerator;