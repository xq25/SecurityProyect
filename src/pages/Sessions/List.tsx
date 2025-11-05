import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Session } from "../../models/Session";
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const ListSessions: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    if (!userId) {
      console.error("❌ No user ID provided");
      return;
    }

    setLoading(true);

    try {
      // Obtener datos del usuario
      const userData = await userService.getUserById(Number(userId));
      setUser(userData);

      // Obtener sesiones del usuario
      const sessionsData = await sessionService.getSessionsByUserId(Number(userId));
      console.log("📊 Sessions loaded:", sessionsData);
      setSessions(sessionsData || []);
    } catch (error) {
      console.error("❌ Error loading sessions:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron cargar las sesiones",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSession = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleEndSession = async (sessionId: string) => {
    const result = await Swal.fire({
      title: "¿Cerrar esta sesión?",
      text: "La sesión será marcada como revocada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await sessionService.endSession(sessionId);

        Swal.fire({
          title: "¡Sesión cerrada!",
          text: "La sesión se cerró correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo cerrar la sesión", "error");
      }
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    const result = await Swal.fire({
      title: "¿Eliminar esta sesión?",
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
        await sessionService.deleteSession(sessionId);

        Swal.fire({
          title: "¡Eliminada!",
          text: "La sesión se eliminó correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        fetchData();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la sesión", "error");
      }
    }
  };

  const handleDeleteAllSessions = async () => {
    if (!userId) return;

    const activeSessions = sessions.filter(
      (s) => s.State?.toLowerCase() === "active" || s.state?.toLowerCase() === "active"
    );

    if (activeSessions.length === 0) {
      Swal.fire("Info", "No hay sesiones activas para cerrar", "info");
      return;
    }

    const result = await Swal.fire({
      title: "¿Cerrar todas las sesiones activas?",
      text: `Esto cerrará ${activeSessions.length} sesión(es) de ${user?.name || "este usuario"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cerrar todas",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        let successCount = 0;

        for (const session of activeSessions) {
          if (session.id) {
            const success = await sessionService.deleteSession(session.id);
            if (success) successCount++;
          }
        }

        Swal.fire({
          title: "¡Sesiones cerradas!",
          text: `Se cerraron ${successCount} de ${activeSessions.length} sesiones activas`,
          icon: "success",
        });

        fetchData();
      } catch (error) {
        Swal.fire("Error", "Hubo un problema al cerrar las sesiones", "error");
      }
    }
  };

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateString);
    }
  };

  const getStateColor = (state: string | undefined) => {
    const normalizedState = state?.toLowerCase();
    switch (normalizedState) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "expired":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "revoked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStateLabel = (state: string | undefined) => {
    const normalizedState = state?.toLowerCase();
    switch (normalizedState) {
      case "active":
        return "✅ Activa";
      case "expired":
        return "⏱️ Expirada";
      case "revoked":
        return "🚫 Revocada";
      default:
        return state || "Desconocido";
    }
  };

  const activeSessionsCount = sessions.filter(
    (s) => s.State?.toLowerCase() === "active" || s.state?.toLowerCase() === "active"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando sesiones...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName={`Sesiones de ${user?.name || "Usuario"}`} />

      <div className="flex flex-col gap-6">
        {/* Información del Usuario */}
        {user && (
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                  👤 {user.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Email:
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-semibold">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      ID:
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white font-semibold">
                      {user.id}
                    </p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="text-right">
                <div className="mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    {activeSessionsCount}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sesiones activas
                  </p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {sessions.length}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total sesiones
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/users/list")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Volver a Usuarios
              </button>

              
            </div>
          </div>
        )}

        {/* Lista de Sesiones */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              🔐 Sesiones ({sessions.length})
            </h3>
          </div>

          <div className="p-6">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
                  📭 No hay sesiones registradas
                </p>
                <p className="text-sm text-gray-400">
                  Las sesiones aparecerán aquí cuando el usuario inicie sesión
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-2 dark:bg-meta-4">
                      <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                        Expiración
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-black dark:text-white">
                        Creada
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-black dark:text-white">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session, index) => (
                      <tr
                        key={session.id}
                        className={`border-b dark:border-strokedark ${
                          index % 2 === 0 ? "bg-white dark:bg-boxdark" : "bg-gray-2 dark:bg-meta-4"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <p className="text-sm text-black dark:text-white font-mono">
                            {session.id?.substring(0, 8)}...
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-3 py-1 text-sm rounded-full ${getStateColor(
                              session.State || session.state
                            )}`}
                          >
                            {getStateLabel(session.State || session.state)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-black dark:text-white">
                            {formatDate(session.expiration)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-black dark:text-white">
                            {formatDate(session.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewSession(session.id!)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                              title="Ver detalles"
                            >
                              👁️ Ver
                            </button>

                            {(session.State?.toLowerCase() === "active" || session.state?.toLowerCase() === "active") && session.id && (
                              <button
                                onClick={() => handleEndSession(session.id!)}
                                className="px-3 py-1.5 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                                title="Cerrar sesión"
                              >
                                🔒 Cerrar
                              </button>
                            )}

                            {session.id && (
                              <button
                                onClick={() => handleDeleteSession(session.id!)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                title="Eliminar sesión"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSessions;