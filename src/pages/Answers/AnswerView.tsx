import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const AnswerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const [answerData, users, questions] = await Promise.all([
        answerService.getAnswerById(parseInt(id)),
        userService.getUsers(),
        securityQuestionService.getSecurityQuestions(),
      ]);

      if (answerData) {
        const enrichedAnswer = {
          ...answerData,
          user: users.find((u) => u.id === answerData.user_id),
          question: questions.find((q) => q.id === answerData.security_question_id),
        };

        setAnswer(enrichedAnswer);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo cargar la respuesta",
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
        <p className="mt-3">Cargando respuesta...</p>
      </div>
    );
  }

  if (!answer) {
    return <div className="alert alert-danger">Respuesta no encontrada</div>;
  }

  return (
    <div>
      <h2>Detalles de la Respuesta</h2>
      <Breadcrumb pageName="Answers / Ver" />

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted fw-bold">ID:</label>
                <p className="fs-5 mb-0">{answer.id}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted fw-bold">Usuario ID:</label>
                <p className="fs-5 mb-0">{answer.user_id || "N/A"}</p>
              </div>
            </div>
          </div>

          {answer.user && (
            <div className="mb-4 p-3 bg-light rounded">
              <h5 className="mb-3">
                <i className="bi bi-person-circle me-2"></i>
                Información del Usuario
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <strong>Nombre:</strong>
                  <p className="mb-2">{answer.user.name}</p>
                </div>
                <div className="col-md-6">
                  <strong>Email:</strong>
                  <p className="mb-2">{answer.user.email}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label text-muted fw-bold">Pregunta ID:</label>
            <p className="mb-2">{answer.security_question_id || "N/A"}</p>
          </div>

          {answer.question && (
            <div className="mb-4 p-3 bg-light rounded">
              <h5 className="mb-3">
                <i className="bi bi-question-circle me-2"></i>
                Pregunta de Seguridad
              </h5>
              <p className="fs-5 mb-2">{answer.question.name}</p>
              {answer.question.description && (
                <p className="text-muted mb-0">
                  <small>{answer.question.description}</small>
                </p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label text-muted fw-bold">Respuesta:</label>
            <div className="alert alert-info d-flex align-items-center">
              <i className="bi bi-shield-lock fs-4 me-3"></i>
              <span className="fs-5">{answer.content}</span>
            </div>
          </div>

          <div className="d-flex gap-2 pt-3 border-top">
            <button
              className="btn btn-primary px-4"
              onClick={() => navigate(`/answers/update/${answer.id}`)}
            >
              <i className="bi bi-pencil me-2"></i>
              Editar
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/answers/list")}
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

export default AnswerView;