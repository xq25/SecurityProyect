import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import Swal from "sweetalert2";
import { sessionService } from "../../services/sessionService";
import { userService } from "../../services/userService";
import { Session } from "../../models/Session";

const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Verificar que userService esté disponible
  useEffect(() => {
    (async () => {
      try {
        // Intentar cargar usuarios si existe el servicio
        if (userService && typeof userService.getUsers === 'function') {
          await userService.getUsers();
        }
      } catch (err) {
        console.warn('UserService no disponible:', err);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  // Fecha de expiración por defecto (24 horas desde ahora)
  const getDefaultExpiration = (): string => {
    const date = new Date();
    date.setHours(date.getHours() + 24);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const validationSchema = Yup.object({
    userId: Yup.number()
      .required("Usuario es requerido")
      .positive("Usuario inválido")
      .integer("Usuario debe ser un número entero"),
    token: Yup.string()
      .optional(),
    State: Yup.string()
      .oneOf(["active", "inactive", "expired", "revoked"], "Estado inválido")
      .required("Estado es requerido"),
    FACode: Yup.string()
      .optional(),
    expiration: Yup.string()
      .required("Fecha de expiración es requerida")
      .matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
        "Formato: YYYY-MM-DDTHH:MM"
      ),
  });

  const labels: (keyof Session)[] = ["userId", "token", "State", "FACode", "expiration"];

  // Valores iniciales
  const initialValues = {
    userId: "",
    token: "",
    State: "active",
    FACode: "",
    expiration: getDefaultExpiration(),
  };

  const handleCreate = async (values: any) => {
    try {
      console.log("📝 Creating session with values:", values);
      
      const payload: any = {
        State: values.State,
        FACode: values.FACode || "",
        expiration: values.expiration,
      };

      // Solo incluir token si no está vacío
      if (values.token && values.token.trim()) {
        payload.token = values.token;
      }

      await sessionService.createSession(parseInt(values.userId), payload);
      
      Swal.fire({ 
        title: "Creado", 
        text: "Sesión creada correctamente", 
        icon: "success", 
        timer: 1500, 
        showConfirmButton: false 
      });
      
      navigate("/sessions");
    } catch (err: any) {
      console.error("Error creating session:", err);
      console.error("Response data:", err.response?.data);
      
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMsg = Array.isArray(errors) 
          ? errors.map((e: any) => e.message || e).join(", ")
          : errors;
        Swal.fire("Error de validación", errorMsg, "error");
      } else {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "No se pudo crear la sesión";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  if (loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Crear Sesión" />
      
      {/* Nota informativa */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-boxdark-2 rounded border border-blue-200 dark:border-strokedark">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>ℹ️ Información importante:</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
          <li><strong>Token:</strong> Déjalo vacío para que se genere automáticamente (UUID)</li>
          <li><strong>Expiración:</strong> Formato YYYY-MM-DDTHH:MM (ejemplo: {getDefaultExpiration()})</li>
          <li><strong>Por defecto:</strong> Se establece 24 horas desde ahora</li>
          <li><strong>Estado:</strong> Normalmente será "active" al crear</li>
        </ul>
      </div>

      <AppForm 
        mode={1} 
        labels={labels as string[]} 
        info={initialValues} 
        handleAction={handleCreate} 
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default CreateSession;