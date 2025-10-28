import React from "react";
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { SecurityQuestion } from "../../models/SecurityQuestion";

const CreateSecurityQuestion: React.FC = () => {
  const navigate = useNavigate();

  const securityQuestionValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre es obligatorio")
      .min(5, "El nombre debe tener al menos 5 caracteres")
      .max(100, "El nombre no puede tener más de 100 caracteres")
      .matches(
        /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s¿?]+$/,
        "El nombre solo puede contener letras, espacios y signos de interrogación"
      ),

    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(10, "La descripción debe tener al menos 10 caracteres")
      .max(300, "La descripción no puede tener más de 300 caracteres"),
  });

  const handleCreateSecurityQuestion = async (question: SecurityQuestion) => {
    try {
      const createdQuestion = await securityQuestionService.createSecurityQuestion(question);

      if (createdQuestion) {
        Swal.fire({
          title: "Completado",
          text: "Se ha creado correctamente la pregunta de seguridad",
          icon: "success",
          timer: 3000,
        });
        navigate("/security-questions/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de crear la pregunta de seguridad",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de crear la pregunta de seguridad",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <h2>Crear Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Crear Pregunta" />
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