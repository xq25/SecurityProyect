import React from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { securityQuestionService } from "../../services/securityQuestionService";
import { AppForm } from "../../components/ui/FormGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const CreateSecurityQuestion: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Esquema de validación según el modelo real
  const securityQuestionValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, "El nombre debe tener al menos 5 caracteres")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .required("El nombre es obligatorio"),
    description: Yup.string()
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(500, "La descripción no puede exceder 500 caracteres")
      .required("La descripción es obligatoria"),
  });

  // ✅ Handler de creación
  const handleCreateSecurityQuestion = async (securityQuestion: any) => {
    try {
      const created = await securityQuestionService.createSecurityQuestion(
        securityQuestion
      );

      if (created) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Pregunta de seguridad creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/security-questions/list");
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo crear la pregunta de seguridad",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <h2>Crear Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Crear" />

      {/* ✅ AppForm sin select (no hay relación con User) */}
      <AppForm
        mode={1}
        labels={["name", "description"]}
        handleAction={handleCreateSecurityQuestion}
        validationSchema={securityQuestionValidationSchema}
      />
    </div>
  );
};

export default CreateSecurityQuestion;