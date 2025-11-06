import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";
import { useUI } from "../../context/UIProvider";

const CreateAnswer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { library } = useUI();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [content, setContent] = useState<string>("");

  const [touched, setTouched] = useState({
    user: false,
    question: false,
    content: false,
  });

  const [errors, setErrors] = useState({
    user: "",
    question: "",
    content: "",
  });

  const userIdParam = searchParams.get("userId");
  const questionIdParam = searchParams.get("questionId");

  // ✅ Cargar usuarios y preguntas al montar
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersData, questionsData] = await Promise.all([
        userService.getUsers(),
        securityQuestionService.getSecurityQuestions(),
      ]);

      setUsers(usersData);
      setQuestions(questionsData);

      // ✅ Preseleccionar si vienen en URL
      if (userIdParam) {
        setSelectedUserId(parseInt(userIdParam));
        setTouched((prev) => ({ ...prev, user: true }));
      }

      if (questionIdParam) {
        setSelectedQuestionId(parseInt(questionIdParam));
        setTouched((prev) => ({ ...prev, question: true }));
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos necesarios",
        icon: "error",
      });
    }
  };

  // ✅ Validaciones
  const validateUser = (userId: number): string => {
    if (userId === 0) return "Debe seleccionar un usuario";
    return "";
  };

  const validateQuestion = (questionId: number): string => {
    if (questionId === 0) return "Debe seleccionar una pregunta";
    return "";
  };

  const validateContent = (text: string): string => {
    if (!text.trim()) return "El contenido es obligatorio";
    if (text.length < 3) return "El contenido debe tener al menos 3 caracteres";
    if (text.length > 500) return "El contenido no puede exceder 500 caracteres";
    return "";
  };

  // ✅ Handlers
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    setSelectedUserId(userId);
    setTouched((prev) => ({ ...prev, user: true }));

    const error = validateUser(userId);
    setErrors((prev) => ({ ...prev, user: error }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const questionId = parseInt(e.target.value);
    setSelectedQuestionId(questionId);
    setTouched((prev) => ({ ...prev, question: true }));

    const error = validateQuestion(questionId);
    setErrors((prev) => ({ ...prev, question: error }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);
    setTouched((prev) => ({ ...prev, content: true }));

    const error = validateContent(text);
    setErrors((prev) => ({ ...prev, content: error }));
  };

  // ✅ Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos como touched
    setTouched({ user: true, question: true, content: true });

    // Validar
    const userError = validateUser(selectedUserId);
    const questionError = validateQuestion(selectedQuestionId);
    const contentError = validateContent(content);

    setErrors({
      user: userError,
      question: questionError,
      content: contentError,
    });

    if (userError || questionError || contentError) {
      Swal.fire({
        title: "Formulario incompleto",
        text: "Por favor complete todos los campos requeridos",
        icon: "warning",
      });
      return;
    }

    try {
      const created = await answerService.createAnswer(
        selectedUserId,
        selectedQuestionId,
        content
      );

      if (created) {
        Swal.fire({
          title: "¡Éxito!",
          text: "Respuesta creada correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Navegación condicional
        if (userIdParam) {
          navigate(`/answers/list?userId=${userIdParam}`);
        } else if (questionIdParam) {
          navigate(`/answers/list?questionId=${questionIdParam}`);
        } else {
          navigate("/answers/list");
        }
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo crear la respuesta",
        icon: "error",
      });
    }
  };

  const isFormValid =
    !errors.user &&
    !errors.question &&
    !errors.content &&
    touched.user &&
    touched.question &&
    touched.content &&
    selectedUserId !== 0 &&
    selectedQuestionId !== 0 &&
    content.trim() !== "";

  // ✅ Clase del botón según librería
  const getButtonClass = () => {
    if (library === "bootstrap") return "btn btn-success w-100 fw-bold text-uppercase";
    if (library === "material") return "btn btn-primary w-100 fw-bold text-uppercase";
    if (library === "tailwind") return "btn btn-purple w-100 fw-bold text-uppercase";
    return "btn btn-primary w-100 fw-bold text-uppercase";
  };

  return (
    <div>
      <h2>Crear Respuesta</h2>
      <Breadcrumb pageName="Answers / Crear" />

      <form onSubmit={handleSubmit} className="mt-4">
        {/* ✅ Select Usuario */}
        <div className="mb-4">
          <label htmlFor="user" className="form-label fw-semibold">
            Usuario
            <span className="text-danger"> *</span>
          </label>
          <select
            id="user"
            className={`form-select ${
              touched.user && errors.user ? "is-invalid" : ""
            } ${touched.user && !errors.user && selectedUserId !== 0 ? "is-valid" : ""}`}
            value={selectedUserId}
            onChange={handleUserChange}
            onBlur={() => setTouched((prev) => ({ ...prev, user: true }))}
            disabled={!!userIdParam}
          >
            <option value="0">Seleccionar usuario...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.email}
              </option>
            ))}
          </select>

          {touched.user && errors.user && (
            <div className="invalid-feedback d-block">{errors.user}</div>
          )}

          {userIdParam && (
            <small className="form-text text-muted d-block mt-1">
              <i className="bi bi-info-circle me-1"></i>
              Este campo no puede ser modificado
            </small>
          )}
        </div>

        {/* ✅ Select Pregunta */}
        <div className="mb-4">
          <label htmlFor="question" className="form-label fw-semibold">
            Pregunta de Seguridad
            <span className="text-danger"> *</span>
          </label>
          <select
            id="question"
            className={`form-select ${
              touched.question && errors.question ? "is-invalid" : ""
            } ${
              touched.question && !errors.question && selectedQuestionId !== 0
                ? "is-valid"
                : ""
            }`}
            value={selectedQuestionId}
            onChange={handleQuestionChange}
            onBlur={() => setTouched((prev) => ({ ...prev, question: true }))}
            disabled={!!questionIdParam}
          >
            <option value="0">Seleccionar pregunta...</option>
            {questions.map((question) => (
              <option key={question.id} value={question.id}>
                {question.name}
              </option>
            ))}
          </select>

          {touched.question && errors.question && (
            <div className="invalid-feedback d-block">{errors.question}</div>
          )}

          {questionIdParam && (
            <small className="form-text text-muted d-block mt-1">
              <i className="bi bi-info-circle me-1"></i>
              Este campo no puede ser modificado
            </small>
          )}
        </div>

        {/* ✅ Textarea Contenido */}
        <div className="mb-4">
          <label htmlFor="content" className="form-label fw-semibold">
            Contenido
            <span className="text-danger"> *</span>
          </label>
          <textarea
            id="content"
            className={`form-control ${
              touched.content && errors.content ? "is-invalid" : ""
            } ${
              touched.content && !errors.content && content.trim() !== ""
                ? "is-valid"
                : ""
            }`}
            rows={5}
            value={content}
            onChange={handleContentChange}
            onBlur={() => setTouched((prev) => ({ ...prev, content: true }))}
            placeholder="Escriba su respuesta aquí..."
          />

          {touched.content && errors.content && (
            <div className="invalid-feedback d-block">{errors.content}</div>
          )}

          <small className="form-text text-muted d-block mt-1">
            {content.length}/500 caracteres
          </small>
        </div>

        {/* ✅ Botón submit */}
        <button
          type="submit"
          className={`${getButtonClass()} mt-3`}
          disabled={!isFormValid}
        >
          CREAR
        </button>
      </form>
    </div>
  );
};

export default CreateAnswer;