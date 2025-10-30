import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { sessionService } from "../../services/sessionService";
import { Session } from "../../models/Session";

const ListSessions: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // userId
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    const data = await sessionService.getSessionsByUser(Number(id));
    setSessions(data);
  };

  const handleInvalidate = async (sessionId: string) => {
    const result = await Swal.fire({
      title: "¿Invalidar sesión?",
      text: "Esta acción cerrará la sesión del usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, invalidar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const success = await sessionService.deleteSession(sessionId);
      if (success) {
        Swal.fire({
          title: "Sesión invalidada",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        await fetchData();
      } else {
        Swal.fire({
          title: "Error al invalidar sesión",
          icon: "error",
          timer: 2500,
        });
      }
    }
  };

  // Header de columnas
  const header = ["ID", "Token", "User ID", "Expiración", "2FA Code", "Estado"];

  return (
    <div>
      <Breadcrumb pageName={`Sesiones del Usuario #${id}`} />
      <div className="p-6">
        <AppTable
          name="Sessions"
          header={header}
          items={sessions}
          options={sessions.map((session) => (
            <AppButton
              key={session.id}
              name="invalidate"
              action={() => handleInvalidate(session.id || '')}
            />
          ))}
        />
        {sessions.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No hay sesiones activas para este usuario
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSessions;