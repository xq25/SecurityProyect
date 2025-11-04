import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const AnswerUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
        setContent(enrichedAnswer.content || "");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      Swal.fire("Error", "Debe ingresar una respuesta", "error");
      return;
    }

    setUpdating(true);

    try {
      await answerService.updateAnswer(parseInt(id!), content);

      Swal.fire({
        title: "¡Éxito!",
        text: "Respuesta actualizada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/answers/list");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la respuesta",
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
        <p className="mt-3">Cargando respuesta...</p>
      </div>
    );
  }

  if (!answer) {
    return <div className="alert alert-danger">Respuesta no encontrada</div>;
  }

  return (
    <div>
      <h2>Actualizar Respuesta de Seguridad</h2>
      <Breadcrumb pageName="Answers / Actualizar" />

      {updating && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Actualizando respuesta...
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Pregunta de Seguridad</label>
              <p className="form-control-plaintext bg-light p-2 rounded">
                {answer.question?.name || "Pregunta no disponible"}
              </p>
              {answer.question?.description && (
                <small className="text-muted d-block mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  {answer.question.description}
                </small>
              )}
              <small className="text-muted">
                <i className="bi bi-lock me-1"></i>
                La pregunta no puede ser modificada
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Usuario</label>
              <p className="form-control-plaintext bg-light p-2 rounded">
                {answer.user ? (
                  <>
                    {answer.user.name}
                    {answer.user.email && ` (${answer.user.email})`}
                  </>
                ) : (
                  "Usuario no disponible"
                )}
              </p>
              <small className="text-muted">
                <i className="bi bi-lock me-1"></i>
                El usuario no puede ser modificado
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Respuesta *</label>
              <textarea
                className="form-control"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ingrese la nueva respuesta..."
                required
                disabled={updating}
              />
              <small className="text-muted">
                <i className="bi bi-shield-check me-1"></i>
                Solo puedes modificar el contenido de la respuesta
              </small>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Actualizar
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/answers/list")}
                disabled={updating}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnswerUpdate;