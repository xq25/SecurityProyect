import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { userService } from "../../services/userService";
import { securityQuestionService } from "../../services/securityQuestionService";
import { User } from "../../models/User";
import { SecurityQuestion } from "../../models/SecurityQuestion";
import { Answer } from "../../models/Answer";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UpdateAnswer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<SecurityQuestion[]>([]);
  const [formData, setFormData] = useState({
    content: "",
    userId: 0,
    securityQuestionId: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const answerData = await answerService.getAnswerById(parseInt(id));
    const usersData = await userService.getUsers();
    const questionsData = await securityQuestionService.getSecurityQuestions();

    if (answerData) {
      setFormData({
        content: answerData.content ?? "",
        userId: answerData.userId ?? 0,
        securityQuestionId: answerData.securityQuestionId ?? 0,
      });
    }

    setUsers(usersData);
    setQuestions(questionsData);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (formData.content.trim() === "") {
      Swal.fire("Error", "Debe ingresar una respuesta", "error");
      return;
    }

    try {
      const updated = await answerService.updateAnswer(parseInt(id), formData);

      if (updated) {
        Swal.fire({
          title: "Completado",
          text: "Respuesta actualizada correctamente",
          icon: "success",
          timer: 3000,
        });
        navigate("/answers/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar la respuesta",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar la respuesta",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Actualizar Respuesta de Seguridad</h2>
      <Breadcrumb pageName="Answers / Actualizar" />

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
                disabled
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
              <div className="form-text">El usuario no puede ser modificado</div>
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
                disabled
              >
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.name}
                  </option>
                ))}
              </select>
              <div className="form-text">
                La pregunta no puede ser modificada
              </div>
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
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-warning">
                Actualizar
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

export default UpdateAnswer;