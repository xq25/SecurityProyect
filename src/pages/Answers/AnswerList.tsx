import React, { useState, useEffect } from "react";
import { Answer } from "../../models/Answer";
import { answerService } from "../../services/answerService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const ListAnswers: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");
  const questionIdParam = searchParams.get("questionId");

  useEffect(() => {
    fetchData();
  }, [userIdParam, questionIdParam]);

  const fetchData = async () => {
    if (userIdParam) {
      const answersData = await answerService.getAnswersByUserId(parseInt(userIdParam));
      setAnswers(answersData);
    } else if (questionIdParam) {
      const answersData = await answerService.getAnswersByQuestionId(parseInt(questionIdParam));
      setAnswers(answersData);
    } else {
      const answersData = await answerService.getAnswers();
      setAnswers(answersData);
    }
  };

  const handleAction = async (action: string, answer: Answer) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: "¿Desea eliminar esta respuesta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const success = await answerService.deleteAnswer(answer.id!);
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Respuesta eliminada correctamente",
            icon: "success",
          });
          fetchData();
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la respuesta",
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

  // Preparar datos para mostrar en la tabla con información relacionada
  const displayAnswers = answers.map((answer) => ({
    id: answer.id,
    content: answer.content,
    userId: answer.userId,
    userName: answer.user?.name || "N/A",
    questionId: answer.securityQuestionId,
    questionName: answer.securityQuestion?.name || "N/A",
  }));

  return (
    <div>
      <h2>Listado de Respuestas de Seguridad</h2>
      <Breadcrumb pageName="Answers / Lista" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          {userIdParam && (
            <span className="badge bg-info me-2">
              Filtrando por Usuario ID: {userIdParam}
            </span>
          )}
          {questionIdParam && (
            <span className="badge bg-info">
              Filtrando por Pregunta ID: {questionIdParam}
            </span>
          )}
        </div>
        <AppButton name="crear" action={() => navigate("/answers/create")} />
      </div>

      <AppTable
        name="Respuestas"
        header={["id", "content", "userId", "userName", "questionId", "questionName"]}
        items={displayAnswers}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(answer) => handleAction(opt.name, answer)}
          />
        ))}
      />
    </div>
  );
};

export default ListAnswers;