import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { securityQuestionService } from "../../services/securityQuestionService";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { AppForm } from "../../components/ui/FormGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UpdateSecurityQuestion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [securityQuestion, setSecurityQuestion] = useState<SecurityQuestion | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar datos
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const securityQuestionData =
        await securityQuestionService.getSecurityQuestionById(parseInt(id));
      setSecurityQuestion(securityQuestionData);
    } catch (error) {
      console.error("Error al cargar pregunta de seguridad:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar la pregunta de seguridad",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Esquema de validación
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

  // ✅ Handler de actualización
  const handleUpdateSecurityQuestion = async (
    updatedSecurityQuestion: SecurityQuestion
  ) => {
    try {
      const updated = await securityQuestionService.updateSecurityQuestion(
        parseInt(id!),
        updatedSecurityQuestion
      );

      if (updated) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Pregunta de seguridad actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/security-questions/${id}`);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo actualizar la pregunta de seguridad",
        icon: "error",
      });
    }
  };

  // ✅ Estados de carga
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando pregunta de seguridad...</p>
      </div>
    );
  }

  if (!securityQuestion) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Pregunta de seguridad no encontrada
      </div>
    );
  }

  return (
    <div>
      <h2>Actualizar Pregunta de Seguridad</h2>
      <Breadcrumb pageName="Security Questions / Actualizar" />

      {/* ✅ AppForm con mode=2 e info */}
      <AppForm
        mode={2}
        labels={["name", "description"]}
        info={securityQuestion}
        handleAction={handleUpdateSecurityQuestion}
        validationSchema={securityQuestionValidationSchema}
      />
    </div>
  );
};

export default UpdateSecurityQuestion;