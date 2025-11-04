import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { Answer } from "../../models/Answer";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { useUI } from "../../context/UIProvider";

const UpdateAnswer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { library } = useUI();
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<SecurityQuestion | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  // ✅ Cargar datos con Promise.all
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const answerData = await answerService.getAnswerById(parseInt(id));
      setAnswer(answerData);
      setContent(answerData?.content || "");

      // ✅ Cargar user y question relacionados
      if (answerData?.user_id) {
        const userData = await userService.getUserById(answerData.user_id);
        setUser(userData);
      }

      if (answerData?.security_question_id) {
        const questionData = await securityQuestionService.getSecurityQuestionById(
          answerData.security_question_id
        );
        setQuestion(questionData);
      }
    } catch (error) {
      console.error("Error al cargar respuesta:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar la respuesta",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateContent = (text: string): string => {
    if (!text.trim()) return "El contenido es obligatorio";
    if (text.length < 3) return "El contenido debe tener al menos 3 caracteres";
    if (text.length > 500) return "El contenido no puede exceder 500 caracteres";
    return "";
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setTouched(true);

    const validationError = validateContent(text);
    setError(validationError);
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched(true);

    const validationError = validateContent(content);
    setError(validationError);

    if (validationError) {
      Swal.fire({
        title: "Error de validación",
        text: validationError,
        icon: "warning",
      });
      return;
    }

    try {
      const updated = await answerService.updateAnswer(parseInt(id!), content);

      if (updated) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Respuesta actualizada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/answers/${id}`);
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo actualizar la respuesta",
        icon: "error",
      });
    }
  };

  const isFormValid = !error && touched && content.trim() !== "";

  // ✅ Clase del botón según librería
  const getPrimaryButtonClass = () => {
    if (library === "bootstrap")
      return "btn btn-success flex-fill fw-bold text-uppercase";
    if (library === "material")
      return "btn btn-primary flex-fill fw-bold text-uppercase";
    if (library === "tailwind")
      return "btn btn-purple flex-fill fw-bold text-uppercase";
    return "btn btn-primary flex-fill fw-bold text-uppercase";
  };

  // ✅ Estados de carga
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando respuesta...</p>
      </div>
    );
  }

  if (!answer) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Respuesta no encontrada
      </div>
    );
  }

  return (
    <div>
      <h2>Actualizar Respuesta</h2>
      <Breadcrumb pageName="Answers / Actualizar" />

      {/* ✅ Card de información relacionada */}
      <div className="row mb-4">
        {/* Usuario */}
        {user && (
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title mb-3">
                  <i className="bi bi-person-circle me-2"></i>
                  Usuario
                </h6>
                <p className="mb-1">
                  <strong>Nombre:</strong> {user.name}
                </p>
                <p className="mb-0 text-secondary">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pregunta */}
        {question && (
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h6 className="card-title mb-3">
                  <i className="bi bi-question-circle me-2"></i>
                  Pregunta de Seguridad
                </h6>
                <p className="mb-1">
                  <strong>Nombre:</strong> {question.name}
                </p>
                <p className="mb-0 text-secondary">
                  <strong>Descripción:</strong> {question.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* ✅ Textarea Contenido */}
        <div className="mb-4">
          <label htmlFor="content" className="form-label fw-semibold">
            Contenido
            <span className="text-danger"> *</span>
          </label>
          <textarea
            id="content"
            className={`form-control ${touched && error ? "is-invalid" : ""} ${
              touched && !error && content.trim() !== "" ? "is-valid" : ""
            }`}
            rows={5}
            value={content}
            onChange={handleContentChange}
            onBlur={() => setTouched(true)}
            placeholder="Escriba su respuesta aquí..."
          />

          {touched && error && (
            <div className="invalid-feedback d-block">{error}</div>
          )}

          <small className="form-text text-muted d-block mt-1">
            {content.length}/500 caracteres
          </small>
        </div>

        {/* ✅ Botones */}
        <div className="d-flex gap-2 mt-4">
          <button
            type="submit"
            className={getPrimaryButtonClass()}
            disabled={!isFormValid}
          >
            <i className="bi bi-check-circle me-2"></i>
            ACTUALIZAR
          </button>
          <button
            type="button"
            className="btn btn-secondary flex-fill fw-bold text-uppercase"
            onClick={() => navigate(`/answers/${id}`)}
          >
            <i className="bi bi-x-circle me-2"></i>
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAnswer;