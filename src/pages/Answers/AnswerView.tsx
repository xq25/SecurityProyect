import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Breadcrumb from "../../components/Breadcrumb";

const ViewAnswer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar datos
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const answerData = await answerService.getAnswerById(parseInt(id));
      setAnswer(answerData);

      // ✅ Cargar relaciones
      if (answerData?.user_id) {
        const userData = await userService.getUserById(answerData.user_id);
        setUser(userData);
      }

      if (answerData?.security_question_id) {
        const questionData = await securityQuestionService.getSecurityQuestionById(
          answerData.security_question_id
        );
        setQuestion(questionData);
      }
    } catch (error) {
      console.error("Error al cargar respuesta:", error);
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
        <p className="mt-3">Cargando respuesta...</p>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Respuesta no encontrada
      </div>
    );
  }

  return (
    <div>
      <h2>Respuesta</h2>
      <Breadcrumb pageName="Answers / Ver" />

      {/* ✅ Card principal */}
      <div className="card">
        <div className="card-body">
          <div className="row">
            {/* Columna izquierda: Contenido de la respuesta */}
            <div className="col-md-6 mb-4">
              <div className="mb-4">
                <label className="form-label text-muted fw-bold mb-1">
                  <i className="bi bi-tag me-2"></i>
                  ID:
                </label>
                <p className="mb-0 fs-5">{answer.id}</p>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted fw-bold mb-1">
                  <i className="bi bi-chat-left-text me-2"></i>
                  Contenido:
                </label>
                <div className="border rounded p-3 bg-light">
                  <p className="mb-0">{answer.content}</p>
                </div>
              </div>
            </div>

            {/* Columna derecha: Información relacionada */}
            <div className="col-md-6 mb-4">
              {/* Usuario */}
              {user && (
                <div className="mb-4 border rounded p-3 bg-light">
                  <h6 className="mb-3 fw-bold">
                    <i className="bi bi-person-circle me-2"></i>
                    Usuario Asociado
                  </h6>
                  <div className="mb-2">
                    <label className="form-label text-muted fw-bold mb-1">
                      Nombre:
                    </label>
                    <p className="mb-0">{user.name}</p>
                  </div>
                  <div className="mb-0">
                    <label className="form-label text-muted fw-bold mb-1">
                      Email:
                    </label>
                    <p className="mb-0 text-secondary">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Pregunta */}
              {question && (
                <div className="border rounded p-3 bg-light">
                  <h6 className="mb-3 fw-bold">
                    <i className="bi bi-question-circle me-2"></i>
                    Pregunta de Seguridad
                  </h6>
                  <div className="mb-2">
                    <label className="form-label text-muted fw-bold mb-1">
                      Nombre:
                    </label>
                    <p className="mb-0">{question.name}</p>
                  </div>
                  <div className="mb-0">
                    <label className="form-label text-muted fw-bold mb-1">
                      Descripción:
                    </label>
                    <p className="mb-0 text-secondary">{question.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ Botones */}
          <div className="d-flex gap-2 mt-4 pt-3 border-top">
            <AppButton name="update" action={() => navigate(`/answers/update/${id}`)} />
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

export default ViewAnswer;