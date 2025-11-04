import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";
import { Session } from "../../models/Session";
import { User } from "../../models/User";

const ListSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;

    const userData = await userService.getUserById(Number(id));
    setUser(userData);

    const sessionsData = await sessionService.getSessionsByUser(String(id));
    setSessions(sessionsData);
  };

  const handleDelete = async (sessionId: string) => {
    const result = await Swal.fire({
      title: "¿Cerrar esta sesión?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await sessionService.deleteSession(sessionId);
      if (success) {
        Swal.fire({
          title: "Sesión cerrada",
          text: "La sesión se cerró correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo cerrar la sesión",
          icon: "error",
        });
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!id) return;

    const result = await Swal.fire({
      title: "¿Cerrar todas las sesiones?",
      text: "Esto cerrará todas las sesiones activas del usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar todas",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await sessionService.deleteAllUserSessions(String(id));
      if (success) {
        Swal.fire({
          title: "Sesiones cerradas",
          text: "Todas las sesiones fueron cerradas",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchData();
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cerrar las sesiones",
          icon: "error",
        });
      }
    }
  };

  const handleView = (sessionId: string) => {
    navigate(`/users/${id}/sessions/${sessionId}`);
  };

  const labels: (keyof Session)[] = [
    "id",
    "userId",
    "State",
    "expiration",
    "FACode",
  ];

  return (
    <div>
      <Breadcrumb pageName="Sessions / List Sessions" />

      {user && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            📋 Sesiones del Usuario
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Nombre:
              </label>
              <p className="mt-1 text-gray-900 font-semibold">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email:
              </label>
              <p className="mt-1 text-gray-900 font-semibold">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate(`/users/view/${id}`)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ← Volver al Usuario
            </button>
            {sessions.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Cerrar Todas las Sesiones
              </button>
            )}
          </div>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="p-6 bg-white rounded-lg shadow text-center">
          <p className="text-gray-600">
            Este usuario no tiene sesiones activas
          </p>
        </div>
      ) : (
        <AppTable
          title={"Sesiones Activas"}
          labels={labels as string[]}
          data={sessions}
          editButton={false}
          createButton={false}
          viewButton={true}
          deleteButton={true}
          actions={{
            onView: (session: Session) => handleView(session.id!),
            onDelete: (session: Session) => handleDelete(session.id!),
          }}
        />
      )}
    </div>
  );
};

export default ListSessions;