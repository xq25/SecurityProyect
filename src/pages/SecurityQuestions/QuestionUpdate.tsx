import React, { useEffect, useState } from "react";
import { AppForm } from "../../components/ui/FormGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { securityQuestionService } from "../../services/securityQuestionService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { SecurityQuestion } from "../../models/SecurityQuestion";

const UpdateSecurityQuestion: React.FC = () => {
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

  const handleUpdateSecurityQuestion = async (questionData: SecurityQuestion) => {
    if (!id) return;

    try {
      const updatedQuestion = await securityQuestionService.updateSecurityQuestion(
        parseInt(id),
        questionData
      );

      if (updatedQuestion) {
        Swal.fire({
          title: "Completado",
          text: "Se ha actualizado correctamente la pregunta de seguridad",
          icon: "success",
          timer: 3000,
        });
        navigate("/security-questions");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de actualizar la pregunta de seguridad",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de actualizar la pregunta de seguridad",
        icon: "error",
        timer: 3000,
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!question) {
    return <div>Pregunta de seguridad no encontrada</div>;
  }

  return (
    <div>
      <h2>Actualizar Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Actualizar Pregunta" />
      <AppForm
        mode={2}
        labels={["name", "description"]}
        info={question}
        handleAction={handleUpdateSecurityQuestion}
        validationSchema={securityQuestionValidationSchema}
      />
    </div>
  );
};

export default UpdateSecurityQuestion;