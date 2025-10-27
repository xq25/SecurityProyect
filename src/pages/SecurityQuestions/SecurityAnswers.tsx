import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { AppTable } from "../../components/ui/TableGeneric";
import Breadcrumb from "../../components/Breadcrumb";

const SecurityQuestionAnswers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const questionData = await securityQuestionService.getSecurityQuestionWithAnswers(parseInt(id));
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
      <h2>Respuestas de la Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Respuestas" />

      <div className="mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{question.name}</h5>
            <p className="card-text">{question.description}</p>
          </div>
        </div>
      </div>

      {question.answers && question.answers.length > 0 ? (
        <AppTable
          name="Respuestas"
          header={["id", "content", "userId"]}
          items={question.answers}
          options={[]}
        />
      ) : (
        <div className="alert alert-info">
          No hay respuestas asociadas a esta pregunta de seguridad
        </div>
      )}

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate("/security-questions/list")}
      >
        Volver
      </button>
    </div>
  );
};

export default SecurityQuestionAnswers;