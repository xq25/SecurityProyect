import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const ListSecurityQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [securityQuestions, setSecurityQuestions] = useState<SecurityQuestion[]>([]);

  useEffect(() => {
    loadSecurityQuestions();
  }, []);

  const loadSecurityQuestions = async () => {
    try {
      const securityQuestionsData =
        await securityQuestionService.getSecurityQuestions();
      setSecurityQuestions(securityQuestionsData);
    } catch (error) {
      console.error("Error al cargar preguntas de seguridad:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las preguntas de seguridad",
        icon: "error",
      });
    }
  };

  const handleAction = async (action: string, securityQuestion: SecurityQuestion) => {
    switch (action) {
      case "view":
        navigate(`/security-questions/${securityQuestion.id}`);
        break;

      case "update":
        navigate(`/security-questions/update/${securityQuestion.id}`);
        break;

      case "delete":
        const result = await Swal.fire({
          title: "¿Estás seguro?",
          text: "Esta acción no se puede deshacer",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          try {
            await securityQuestionService.deleteSecurityQuestion(
              securityQuestion.id!
            );
            Swal.fire({
              title: "¡Eliminado!",
              text: "Pregunta de seguridad eliminada correctamente",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            loadSecurityQuestions();
          } catch (error: any) {
            Swal.fire({
              title: "Error",
              text:
                error.response?.data?.message ||
                "No se pudo eliminar la pregunta de seguridad",
              icon: "error",
            });
          }
        }
        break;

      // ✅ Nueva acción para ver respuestas
      case "answers":
        navigate(`/answers/list?questionId=${securityQuestion.id}`);
        break;

      default:
        break;
    }
  };

  // ✅ Opciones de acciones (agregamos "answers")
  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
    { name: "answers" }, // ✅ Nueva opción
  ];

  return (
    <div>
      <h2>Preguntas de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Lista" />

      <div className="mb-3">
        <AppButton
          name="crear"
          action={() => navigate("/security-questions/create")}
        />
      </div>

      {/* ✅ AppTable con header actualizado */}
      <AppTable
        name="Preguntas de Seguridad"
        header={["id", "name", "description"]}
        items={securityQuestions}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(securityQuestion) => handleAction(opt.name, securityQuestion)}
          />
        ))}
      />
    </div>
  );
};

export default ListSecurityQuestions;