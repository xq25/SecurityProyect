import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const AnswerCreate: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number>(0);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar los datos",
        icon: "error",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserId === 0) {
      Swal.fire("Error", "Debe seleccionar un usuario", "error");
      return;
    }

    if (selectedQuestionId === 0) {
      Swal.fire("Error", "Debe seleccionar una pregunta de seguridad", "error");
      return;
    }

    if (!content.trim()) {
      Swal.fire("Error", "Debe ingresar una respuesta", "error");
      return;
    }

    setLoading(true);

    try {
      await answerService.createAnswer(selectedUserId, selectedQuestionId, content);

      Swal.fire({
        title: "¡Éxito!",
        text: "Respuesta creada correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/answers/list");
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "No se pudo crear la respuesta",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Respuesta de Seguridad</h2>
      <Breadcrumb pageName="Answers / Crear" />

      {loading && (
        <div className="alert alert-info">
          <span className="spinner-border spinner-border-sm me-2"></span>
          Creando respuesta...
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario *</label>
              <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                required
                disabled={loading}
              >
                <option value="0">Seleccionar usuario...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Pregunta de Seguridad *</label>
              <select
                className="form-select"
                value={selectedQuestionId}
                onChange={(e) => setSelectedQuestionId(parseInt(e.target.value))}
                required
                disabled={loading}
              >
                <option value="0">Seleccionar pregunta...</option>
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Respuesta *</label>
              <textarea
                className="form-control"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ingrese la respuesta..."
                required
                disabled={loading}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Creando..." : "Crear"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/answers/list")}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnswerCreate;