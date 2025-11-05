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
  const [loading, setLoading] = useState(true);
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [sessionId]);

  const fetchData = async () => {
    if (!sessionId) {
      console.error("❌ No session ID provided");
      return;
    }

    setLoading(true);

    try {
      const sessionData = await sessionService.getSessionById(sessionId);
      
      if (sessionData) {
        // Formatear datos para mejor visualización
        const formattedSession = {
          ...sessionData,
          // Mostrar solo los primeros 20 caracteres del token
          token: sessionData.token 
            ? `${sessionData.token.substring(0, 20)}...` 
            : 'N/A',
          // Formatear estado
          State: sessionData.State || sessionData.state || 'Desconocido',
          // Formatear fechas
          expiration: sessionData.expiration 
            ? new Date(sessionData.expiration).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A',
          createdAt: sessionData.createdAt
            ? new Date(sessionData.createdAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A',
          updatedAt: sessionData.updatedAt
            ? new Date(sessionData.updatedAt).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : 'N/A',
        };
        
        setSession(formattedSession as Session);
        console.log("✅ Session loaded:", formattedSession);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se encontró la sesión",
          icon: "error",
        });
        navigate(-1);
      }
    } catch (error) {
      console.error("❌ Error loading session:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar la sesión",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sessionId) return;

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
      const success = await sessionService.deleteSession(sessionId);
      
      if (success) {
        Swal.fire({
          title: "¡Eliminada!",
          text: "La sesión se eliminó correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate(-1);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la sesión",
          icon: "error",
        });
      }
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;

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
        
        // Recargar datos
        fetchData();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo cerrar la sesión",
          icon: "error",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  // Determinar si la sesión está activa
  const isActive = session?.State?.toLowerCase() === 'active' || 
                   session?.state?.toLowerCase() === 'active';

  // Opciones de botones dinámicos
  const options = [
    { name: "back", label: "Volver" },
    ...(isActive ? [{ name: "end", label: "Cerrar Sesión" }] : []),
    { name: "delete", label: "Eliminar" },
  ];

  return (
    <div>
      <Breadcrumb pageName="Detalle de Sesión" />
      
      {session ? (
        <AppView
          title="🔐 Información de la Sesión"
          info={session}
          options={options.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={() => {
                if (opt.name === "delete") handleDelete();
                if (opt.name === "end") handleEndSession();
                if (opt.name === "back") navigate(-1);
              }}
            />
          ))}
          toggleableFields={["token"]}
        />
      ) : (
        <div className="p-6 bg-white rounded-lg shadow dark:bg-boxdark">
          <p className="text-gray-600 dark:text-gray-400">No se encontró la sesión</p>
        </div>
      )}
    </div>
  );
};

export default ViewSession;