import { useState } from "react";
import { projectService } from "../services/projectService";
import "../styles/Modal.css";

const ProjectCreateModal = ({ isOpen, onClose, onProjectCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Proje adı zorunludur");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await projectService.createProject(name, description);
      onProjectCreated(response.data);
      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Proje oluşturulamadı");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setDescription("");
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Proje Oluştur</h2>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Proje Adı *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Proje adı girin"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proje açıklaması (opsiyonel)"
              rows="3"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={handleClose}
              disabled={loading}
            >
              İptal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
