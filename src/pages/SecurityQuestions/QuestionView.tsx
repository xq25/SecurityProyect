import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Breadcrumb from "../../components/Breadcrumb";

const ViewSecurityQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [securityQuestion, setSecurityQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar datos
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const securityQuestionData =
        await securityQuestionService.getSecurityQuestionById(parseInt(id));
      setSecurityQuestion(securityQuestionData);
    } catch (error) {
      console.error("Error al cargar pregunta de seguridad:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Estados de carga
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pregunta de seguridad...</p>
      </div>
    );
  }

  if (!securityQuestion) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Pregunta de seguridad no encontrada
      </div>
    );
  }

  return (
    <div>
      <h2>Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Ver" />

      {/* ✅ Card con Bootstrap nativo */}
      <div className="card">
        <div className="card-body">
          <div className="row">
            {/* Información de la pregunta */}
            <div className="col-md-12 mb-4">
              <div className="mb-4">
                <label className="form-label text-muted fw-bold mb-1">
                  <i className="bi bi-tag me-2"></i>
                  ID:
                </label>
                <p className="mb-0 fs-5">{securityQuestion.id}</p>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold mb-1">
                  <i className="bi bi-question-circle me-2"></i>
                  Nombre:
                </label>
                <h4 className="mb-0">{securityQuestion.name}</h4>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold mb-1">
                  <i className="bi bi-file-text me-2"></i>
                  Descripción:
                </label>
                <p className="mb-0 fs-5 text-secondary">
                  {securityQuestion.description}
                </p>
              </div>

              {/* ✅ Mostrar respuestas si existen */}
              {securityQuestion.answers && securityQuestion.answers.length > 0 && (
                <div className="mb-4">
                  <label className="form-label text-muted fw-bold mb-2">
                    <i className="bi bi-chat-left-dots me-2"></i>
                    Respuestas Asociadas:
                  </label>
                  <div className="border rounded p-3 bg-light">
                    {securityQuestion.answers.map((answer, index) => (
                      <div key={answer.id || index} className="mb-2">
                        <span className="badge bg-primary me-2">{index + 1}</span>
                        <span>{answer.answer_text || "Sin texto"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Botones */}
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <AppButton
              name="update"
              action={() => navigate(`/security-questions/update/${id}`)}
            />
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

export default ViewSecurityQuestion;