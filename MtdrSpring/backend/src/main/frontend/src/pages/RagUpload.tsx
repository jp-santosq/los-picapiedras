import React, { useRef, useState } from 'react';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import '../styles/components/rag.css';

type UploadSummary = {
  fileName: string;
  chunksStored: number;
  embeddingDims: number;
};

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

const RagUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadMessage, setUploadMessage] = useState('Carga un archivo para alimentar el contexto del generador.');
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [contextQuery, setContextQuery] = useState('');
  const [contextPreview, setContextPreview] = useState('');
  const [contextLoading, setContextLoading] = useState(false);

  const handleFile = (file: File) => {
    setSelectedFile(file);
    setUploadState('idle');
    setUploadMessage(`Listo para subir: ${file.name}`);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploadState('uploading');
    setUploadMessage('Generando embeddings y guardando en la base vectorial...');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      const response = await axios.post<UploadSummary>('/rag/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSummary(response.data);
      setUploadState('success');
      setUploadMessage(
        `Se indexaron ${response.data.chunksStored} fragmentos del archivo ${response.data.fileName}`
      );
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Error subiendo documento RAG', error);
      const message =
        error?.response?.data || 'No se pudo cargar el archivo. Inténtalo nuevamente.';
      setUploadState('error');
      setUploadMessage(message);
    }
  };

  const handleContextPreview = async () => {
    if (!contextQuery.trim()) return;
    setContextLoading(true);
    setContextPreview('');
    try {
      const response = await axios.get<{ context: string }>('/rag/context', {
        params: { q: contextQuery },
      });
      setContextPreview(response.data.context || 'No se encontraron fragmentos relevantes.');
    } catch (error) {
      console.error('No se pudo obtener contexto', error);
      setContextPreview('No pudimos recuperar contexto en este momento.');
    } finally {
      setContextLoading(false);
    }
  };

  const statusIcon = () => {
    if (uploadState === 'success') return <CheckCircleIcon className="status-icon success" />;
    if (uploadState === 'error') return <WarningAmberIcon className="status-icon error" />;
    if (uploadState === 'uploading') return <div className="status-spinner" />;
    return <AutoAwesomeIcon className="status-icon idle" />;
  };

  return (
    <div className="rag-page">
      <section className="rag-hero">
        <div>
          <p className="hero-eyebrow">Contexto para el generador</p>
          <h1>Knowledge Upload</h1>
          <p className="hero-copy">
            Sube documentos con especificaciones, estándares o user stories. Crearemos embeddings y los
            usaremos como contexto en el generador automático de sprints.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
              <CloudUploadIcon /> Cargar archivo
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setContextQuery('');
                setContextPreview('');
              }}
            >
              Limpiar consulta
            </button>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-icon">
            <AutoAwesomeIcon fontSize="large" />
          </div>
          <p className="hero-card-title">Tu RAG está activo</p>
          <p className="hero-card-subtitle">
            Cada archivo se trocea y se indexa con embeddings de OpenAI para enriquecer las respuestas del
            generador.
          </p>
          <ul className="hero-card-meta">
            <li>Formatos: .txt, .md, .docx</li>
            <li>Chunks solapados para mejor búsqueda</li>
            <li>Contexto inyectado en /tarea/plan-sprint</li>
          </ul>
        </div>
      </section>

      <section className="rag-grid">
        <div
          className={`upload-card ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDrop={handleDrop}
        >
          <div className="upload-header">
            <div>
              <p className="eyebrow">Carga de conocimiento</p>
              <h2>Sube archivos para entrenar el contexto</h2>
              <p className="upload-hint">Arrastra el archivo o haz clic para explorar</p>
            </div>
            <CloudUploadIcon className="upload-icon" />
          </div>

          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Zona de carga"
          >
            {selectedFile ? (
              <div className="file-chip">
                <span className="file-name">{selectedFile.name}</span>
                <span className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <p className="drop-text">Suelta aquí tu .txt, .md o .docx</p>
            )}
          </div>

          <div className="upload-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.docx"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Seleccionar archivo
            </button>
            <button
              className="btn btn-primary"
              disabled={!selectedFile || uploadState === 'uploading'}
              onClick={handleUpload}
            >
              {uploadState === 'uploading' ? 'Subiendo...' : 'Enviar a vector DB'}
            </button>
          </div>

          <div className={`upload-status ${uploadState}`}>
            {statusIcon()}
            <div>
              <p className="status-label">{uploadMessage}</p>
              {summary && uploadState === 'success' && (
                <p className="status-meta">
                  Dimensión del embedding: {summary.embeddingDims} • Fragmentos guardados: {summary.chunksStored}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="context-card">
          <div className="context-header">
            <div>
              <p className="eyebrow">Probar contexto</p>
              <h2>Pregunta algo antes de generar</h2>
              <p className="upload-hint">
                Consulta qué fragmentos devolvería el RAG con tu pregunta y verifícalo antes de generar tareas.
              </p>
            </div>
            <SearchIcon className="upload-icon" />
          </div>

          <div className="context-form">
            <input
              type="text"
              placeholder="Ej. ¿Cuál es el estándar de logging del proyecto?"
              value={contextQuery}
              onChange={(e) => setContextQuery(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={handleContextPreview}
              disabled={!contextQuery.trim() || contextLoading}
            >
              {contextLoading ? 'Buscando...' : 'Obtener contexto'}
            </button>
          </div>

          <div className="context-preview">
            {contextLoading && <p className="muted">Buscando fragmentos relevantes...</p>}
            {!contextLoading && contextPreview && (
              <pre className="context-block">{contextPreview}</pre>
            )}
            {!contextLoading && !contextPreview && (
              <p className="muted">
                Aún no hay vista previa. Ingresa una pregunta y presiona "Obtener contexto".
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RagUpload;
