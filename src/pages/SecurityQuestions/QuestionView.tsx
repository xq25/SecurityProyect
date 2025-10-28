import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";

const ViewSecurityQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const questionData = await securityQuestionService.getSecurityQuestionById(parseInt(id));
    setQuestion(questionData);
    setLoading(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!question) {
    return <div>Pregunta de seguridad no encontrada</div>;
  }

  return (
    <div>
      <h2>Detalles de la Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Ver Pregunta" />

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-12">
              <strong>ID:</strong>
              <p>{question.id}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <strong>Pregunta:</strong>
              <p className="text-lg">{question.name}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <strong>Descripción:</strong>
              <p>{question.description}</p>
            </div>
          </div>

          {question.answers && question.answers.length > 0 && (
            <div className="row mb-3">
              <div className="col-md-12">
                <strong>Número de respuestas asociadas:</strong>
                <p>{question.answers.length}</p>
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/security-questions/update/${question.id}`)}
            >
              Editar
            </button>
            <button
              className="btn btn-info"
              onClick={() => navigate(`/security-questions/answers/${question.id}`)}
            >
              Ver Respuestas
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/security-questions/list")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSecurityQuestion;