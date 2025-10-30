import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { Answer } from "../../models/Answer";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const CreateAnswer: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [formData, setFormData] = useState({
    content: "",
    userId: 0,
    securityQuestionId: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const usersData = await userService.getUsers();
    const questionsData = await securityQuestionService.getSecurityQuestions();
    setUsers(usersData);
    setQuestions(questionsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.userId === 0) {
      Swal.fire("Error", "Debe seleccionar un usuario", "error");
      return;
    }

    if (formData.securityQuestionId === 0) {
      Swal.fire("Error", "Debe seleccionar una pregunta de seguridad", "error");
      return;
    }

    if (formData.content.trim() === "") {
      Swal.fire("Error", "Debe ingresar una respuesta", "error");
      return;
    }

    try {
      // Verificar si el usuario ya respondió esta pregunta
      const alreadyAnswered = await answerService.checkUserAnsweredQuestion(
        formData.userId,
        formData.securityQuestionId
      );

      if (alreadyAnswered) {
        Swal.fire({
          title: "Advertencia",
          text: "El usuario ya ha respondido esta pregunta de seguridad",
          icon: "warning",
        });
        return;
      }

      const created = await answerService.createAnswer(formData);

      if (created) {
        Swal.fire({
          title: "Completado",
          text: "Respuesta creada correctamente",
          icon: "success",
          timer: 3000,
        });
        navigate("/answers/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo crear la respuesta",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al crear la respuesta",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <h2>Crear Respuesta de Seguridad</h2>
      <Breadcrumb pageName="Answers / Crear" />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <select
                className="form-select"
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: parseInt(e.target.value) })
                }
                required
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
              <label className="form-label">Pregunta de Seguridad</label>
              <select
                className="form-select"
                value={formData.securityQuestionId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    securityQuestionId: parseInt(e.target.value),
                  })
                }
                required
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
              <label className="form-label">Respuesta</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Ingrese la respuesta..."
                required
              />
              <div className="form-text">
                La respuesta debe ser algo que solo el usuario pueda recordar
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Crear
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/answers/list")}
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

export default CreateAnswer;