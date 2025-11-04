import React, { useState, useEffect } from "react";
import { Answer } from "../../models/Answer";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const AnswerList: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const userIdParam = searchParams.get("user_id");
  const questionIdParam = searchParams.get("question_id");

  useEffect(() => {
    fetchData();
  }, [userIdParam, questionIdParam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let answersData: Answer[];

      if (questionIdParam) {
        answersData = await answerService.getAnswersByQuestionId(parseInt(questionIdParam));
      } else if (userIdParam) {
        answersData = await answerService.getAnswersByUserId(parseInt(userIdParam));
      } else {
        answersData = await answerService.getAnswers();
      }

      const [users, questions] = await Promise.all([
        userService.getUsers(),
        securityQuestionService.getSecurityQuestions(),
      ]);

      const enrichedAnswers = answersData.map((answer) => ({
        ...answer,
        user: users.find((u) => u.id === answer.user_id),
        question: questions.find((q) => q.id === answer.security_question_id),
      }));

      setAnswers(enrichedAnswers);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudieron cargar las respuestas",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, answer: Answer) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "¿Desea eliminar esta respuesta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await answerService.deleteAnswer(answer.id!);
          Swal.fire({
            title: "¡Eliminado!",
            text: "Respuesta eliminada correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "No se pudo eliminar la respuesta",
            icon: "error",
          });
        }
      }
    } else if (action === "view") {
      navigate(`/answers/${answer.id}`);
    } else if (action === "update") {
      navigate(`/answers/update/${answer.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
  ];

  const displayAnswers = answers.map((answer) => ({
    id: answer.id,
    content: answer.content || "N/A",
    user_id: answer.user_id || "N/A",
    userName: answer.user?.name || "Sin usuario",
    question_id: answer.security_question_id || "N/A",
    questionName: answer.question?.name || "Sin pregunta",
  }));

  return (
    <div>
      <h2>Respuestas de Seguridad</h2>
      <Breadcrumb pageName="Answers / Lista" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex gap-2">
          {userIdParam && (
            <span className="badge bg-info">
              <i className="bi bi-funnel me-1"></i>
              Usuario ID: {userIdParam}
            </span>
          )}
          
          {questionIdParam && (
            <span className="badge bg-warning text-dark">
              <i className="bi bi-funnel me-1"></i>
              Pregunta ID: {questionIdParam}
            </span>
          )}

          {(userIdParam || questionIdParam) && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => navigate("/answers/list")}
            >
              <i className="bi bi-x-circle me-1"></i>
              Limpiar filtros
            </button>
          )}
        </div>
        
        <AppButton name="crear" action={() => navigate("/answers/create")} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando respuestas...</p>
        </div>
      ) : answers.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron respuestas.
        </div>
      ) : (
        <AppTable
          name="Respuestas"
          header={["id", "content", "user_id", "userName", "question_id", "questionName"]}
          items={displayAnswers}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={(answer) => handleAction(opt.name, answer)}
            />
          ))}
        />
      )}
    </div>
  );
};

export default AnswerList;