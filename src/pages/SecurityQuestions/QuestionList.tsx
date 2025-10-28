import React, { useState, useEffect } from "react";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { securityQuestionService } from "../../services/securityQuestionService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate } from "react-router-dom";

const ListSecurityQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const questionsData = await securityQuestionService.getSecurityQuestions();
    setQuestions(questionsData);
  };

  const handleAction = async (action: string, question: SecurityQuestion) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar la pregunta de seguridad "${question.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const success = await securityQuestionService.deleteSecurityQuestion(question.id!);
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Pregunta de seguridad eliminada correctamente",
            icon: "success",
          });
          fetchData();
        } else {
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar la pregunta de seguridad",
            icon: "error",
          });
        }
      }
    } else if (action === "view") {
      navigate(`/security-questions/${question.id}`);
    } else if (action === "update") {
      navigate(`/security-questions/update/${question.id}`);
    } else if (action === "answers") {
      navigate(`/security-questions/answers/${question.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
    { name: "answers" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Preguntas de Seguridad</h2>
        {/* ✅ Usar AppButton en lugar de AppActionButton */}
        <AppButton
          name="crear"
          action={() => navigate("/security-questions/create")}
        />
      </div>

      <AppTable
        name="Preguntas de Seguridad"
        header={["id", "name", "description"]}
        items={questions}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(question) => handleAction(opt.name, question)}
          />
        ))}
      />
    </div>
  );
};

export default ListSecurityQuestions;