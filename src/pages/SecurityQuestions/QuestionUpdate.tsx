import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const SecurityQuestionUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const question = await securityQuestionService.getSecurityQuestionById(parseInt(id));
      if (question) {
        setName(question.name || "");
        setDescription(question.description || "");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo cargar la pregunta",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire("Error", "El nombre de la pregunta es obligatorio", "error");
      return;
    }

    setUpdating(true);

    try {
      await securityQuestionService.updateSecurityQuestion(parseInt(id!), {
        name,
        description,
      });

      Swal.fire({
        title: "¡Éxito!",
        text: "Pregunta actualizada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/security-questions/list");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la pregunta",
        icon: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pregunta...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Actualizar Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Actualizar" />

      {updating && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Actualizando pregunta...
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
                disabled={updating}
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
                disabled={updating}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Actualizando..." : "Actualizar"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/security-questions/list")}
                disabled={updating}
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

export default SecurityQuestionUpdate;