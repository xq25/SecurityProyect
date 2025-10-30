import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { Answer } from "../../models/Answer";
import Breadcrumb from "../../components/Breadcrumb";

const ViewAnswer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const answerData = await answerService.getAnswerById(parseInt(id));
    setAnswer(answerData);
    setLoading(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!answer) {
    return <div>Respuesta no encontrada</div>;
  }

  return (
    <div>
      <h2>Detalles de la Respuesta</h2>
      <Breadcrumb pageName="Answers / Ver" />

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>ID:</strong>
              <p>{answer.id}</p>
            </div>
            <div className="col-md-6">
              <strong>Usuario ID:</strong>
              <p>{answer.userId}</p>
            </div>
          </div>

          {answer.user && (
            <div className="row mb-3">
              <div className="col-md-12">
                <strong>Usuario:</strong>
                <p>
                  {answer.user.name} ({answer.user.email})
                </p>
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-md-12">
              <strong>Pregunta ID:</strong>
              <p>{answer.securityQuestionId}</p>
            </div>
          </div>

          {answer.securityQuestion && (
            <div className="row mb-3">
              <div className="col-md-12">
                <strong>Pregunta de Seguridad:</strong>
                <p className="text-lg">{answer.securityQuestion.name}</p>
              </div>
            </div>
          )}

          <div className="row mb-3">
            <div className="col-md-12">
              <strong>Respuesta:</strong>
              <div className="alert alert-info">
                <i className="bi bi-shield-lock me-2"></i>
                {answer.content}
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/answers/update/${answer.id}`)}
            >
              Editar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/answers/list")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;