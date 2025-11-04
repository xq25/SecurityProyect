import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { AppView } from "../../components/ui/ViewInfoGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { sessionService } from "../../services/sessionService";
import { Session } from "../../models/Session";

const ViewSession: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { id, sessionId } = useParams<{ id: string; sessionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    if (!sessionId) return;
    const sessionData = await sessionService.getSessionById(sessionId);
    setSession(sessionData);
  };

  const handleDelete = async () => {
    if (!sessionId) return;

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
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(`/users/${id}/sessions`);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo cerrar la sesión",
          icon: "error",
        });
      }
    }
  };

  const options = [
    { name: "delete" },
    { name: "back" },
  ];

  return (
    <div>
      <Breadcrumb pageName="Sessions / View Session" />
      {session ? (
        <AppView
          title={"Detalle de la Sesión"}
          info={session}
          options={options.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={() => {
                if (opt.name === "delete") handleDelete();
                if (opt.name === "back") navigate(`/users/${id}/sessions`);
              }}
            />
          ))}
          toggleableFields={["token", "FACode"]}
        />
      ) : (
        <div className="p-6">Cargando sesión...</div>
      )}
    </div>
  );
};

export default ViewSession;