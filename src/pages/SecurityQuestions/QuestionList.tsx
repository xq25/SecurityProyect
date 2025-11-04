import React, { useState, useEffect } from "react";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { securityQuestionService } from "../../services/securityQuestionService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

const SecurityQuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await securityQuestionService.getSecurityQuestions();
      setQuestions(data);
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudieron cargar las preguntas",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, question: SecurityQuestion) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar la pregunta "${question.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        try {
          await securityQuestionService.deleteSecurityQuestion(question.id!);
          Swal.fire({
            title: "¡Eliminado!",
            text: "Pregunta eliminada correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchData();
        } catch (error: any) {
          Swal.fire({
            title: "Error",
            text: error.response?.data?.message || "No se pudo eliminar la pregunta",
            icon: "error",
          });
        }
      }
    } else if (action === "view") {
      navigate(`/security-questions/${question.id}`);
    } else if (action === "update") {
      navigate(`/security-questions/update/${question.id}`);
    } else if (action === "answers") {
      navigate(`/answers/list?question_id=${question.id}`);
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
      <h2>Preguntas de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Lista" />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Listado</h3>
        <AppButton name="crear" action={() => navigate("/security-questions/create")} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando preguntas de seguridad...</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default SecurityQuestionList;