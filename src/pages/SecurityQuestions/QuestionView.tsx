import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const SecurityQuestionView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const data = await securityQuestionService.getSecurityQuestionById(parseInt(id));
      setQuestion(data);
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

  if (!question) {
    return <div className="alert alert-danger">Pregunta no encontrada</div>;
  }

  return (
    <div>
      <h2>Detalles de la Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Ver" />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="mb-3">
            <label className="form-label text-muted fw-bold">ID:</label>
            <p className="fs-5 mb-0">{question.id}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fw-bold">Pregunta:</label>
            <p className="fs-5 mb-0">{question.name}</p>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted fw-bold">Descripción:</label>
            <p className="fs-5 mb-0">{question.description || "Sin descripción"}</p>
          </div>

          <div className="d-flex gap-2 pt-3 border-top">
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate(`/security-questions/update/${question.id}`)}
            >
              <i className="bi bi-pencil me-2"></i>
              Editar
            </button>
            <button
              className="btn btn-info px-4"
              onClick={() => navigate(`/answers/list?question_id=${question.id}`)}
            >
              <i className="bi bi-list-ul me-2"></i>
              Ver Respuestas
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/security-questions/list")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityQuestionView;