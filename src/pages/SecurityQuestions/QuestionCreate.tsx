import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const SecurityQuestionCreate: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Error", "El nombre de la pregunta es obligatorio", "error");
      return;
    }

    setLoading(true);

    try {
      await securityQuestionService.createSecurityQuestion({
        name,
        description,
      });

      Swal.fire({
        title: "¡Éxito!",
        text: "Pregunta de seguridad creada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/security-questions/list");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo crear la pregunta",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Crear" />

      {loading && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Creando pregunta...
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Pregunta *</label>
              <input
                type="text"
                className="form-control"
                placeholder="¿Cuál es tu primera mascota?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Ingrese una descripción opcional"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Creando..." : "Crear"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/security-questions/list")}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionCreate;