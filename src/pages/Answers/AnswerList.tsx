import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { answerService } from "../../services/answerService";
import { Answer } from "../../models/Answer";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const ListAnswers: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [answers, setAnswers] = useState<Answer[]>([]);

  const userIdParam = searchParams.get("userId");
  const questionIdParam = searchParams.get("questionId");

  useEffect(() => {
    loadAnswers();
  }, [userIdParam, questionIdParam]);

  const loadAnswers = async () => {
    try {
      let answersData: Answer[];

      if (questionIdParam) {
        console.log("Filtrando por pregunta ID:", questionIdParam);
        answersData = await answerService.getAnswersByQuestionId(
          parseInt(questionIdParam)
        );
      } else if (userIdParam) {
        console.log("Filtrando por usuario ID:", userIdParam);
        answersData = await answerService.getAnswersByUserId(parseInt(userIdParam));
      } else {
        console.log("Mostrando todas las respuestas");
        answersData = await answerService.getAnswers();
      }

      console.log("Respuestas cargadas:", answersData);
      setAnswers(answersData);
    } catch (error) {
      console.error("Error al cargar respuestas:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las respuestas",
        icon: "error",
      });
    }
  };

  const handleAction = async (action: string, answer: Answer) => {
    switch (action) {
      case "view":
        navigate(`/answers/${answer.id}`);
        break;

      case "update":
        navigate(`/answers/update/${answer.id}`);
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
            await answerService.deleteAnswer(answer.id!);
            Swal.fire({
              title: "¡Eliminado!",
              text: "Respuesta eliminada correctamente",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            loadAnswers();
          } catch (error: any) {
            Swal.fire({
              title: "Error",
              text:
                error.response?.data?.message || "No se pudo eliminar la respuesta",
              icon: "error",
            });
          }
        }
        break;

      default:
        break;
    }
  };

  const baseOptions = [{ name: "view" }, { name: "update" }, { name: "delete" }];

  return (
    <div>
      <h2>Respuestas</h2>
      <Breadcrumb pageName="Answers / Lista" />

      {/* ✅ Alerta cuando está filtrado por pregunta */}
      {questionIdParam && (
        <div className="alert alert-info mb-3 d-flex align-items-center">
          <i className="bi bi-filter-circle me-2 fs-4"></i>
          <div className="flex-grow-1">
            <strong>Vista Filtrada:</strong> Mostrando solo respuestas de la pregunta ID:{" "}
            <strong>{questionIdParam}</strong>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/answers/list")}
          >
            <i className="bi bi-x-circle me-1"></i>
            Ver todas
          </button>
        </div>
      )}

      {/* ✅ Alerta cuando está filtrado por usuario */}
      {userIdParam && (
        <div className="alert alert-info mb-3 d-flex align-items-center">
          <i className="bi bi-filter-circle me-2 fs-4"></i>
          <div className="flex-grow-1">
            <strong>Vista Filtrada:</strong> Mostrando solo respuestas del usuario ID:{" "}
            <strong>{userIdParam}</strong>
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/answers/list")}
          >
            <i className="bi bi-x-circle me-1"></i>
            Ver todas
          </button>
        </div>
      )}

      {/* ✅ Botón crear con parámetros preservados */}
      <div className="mb-3">
        <AppButton
          name="crear"
          action={() => {
            let createUrl = "/answers/create";
            const params = new URLSearchParams();

            if (questionIdParam) params.append("questionId", questionIdParam);
            if (userIdParam) params.append("userId", userIdParam);

            if (params.toString()) {
              createUrl += `?${params.toString()}`;
            }

            navigate(createUrl);
          }}
        />
      </div>

      {/* ✅ Siempre mostrar tabla (vacía o con datos) */}
      <AppTable
        name="Respuestas"
        header={["id", "content", "user_id", "security_question_id"]}
        items={answers}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(answer) => handleAction(opt.name, answer)}
          />
        ))}
      />
    </div>
  );
};

export default ListAnswers;