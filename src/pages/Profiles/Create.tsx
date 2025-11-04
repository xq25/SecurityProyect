import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { profileService } from "../../services/profileService";
import { userService } from "../../services/userService";
import { Profile } from "../../models/Profile";
import { User } from "../../models/User";

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const userData = await userService.getUserById(Number(id));
      setUser(userData);
    };
    fetchUser();
  }, [id]);

  const validationSchema = Yup.object({
    phone: Yup.string()
      .required("El teléfono es obligatorio")
      .min(10, "Mínimo 10 caracteres"),
    photo: Yup.mixed().nullable(),
  });

  const labels: (keyof Profile)[] = ["phone", "photo"];

  const handleCreate = async (values: any) => {
    if (!id) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el ID del usuario",
        icon: "error",
      });
      return;
    }

    const created = await profileService.createProfile(Number(id), values);
    
    if (created) {
      Swal.fire({
        title: "Perfil creado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/users/view/${id}`);
    } else {
      Swal.fire({
        title: "Error al crear el perfil",
        text: "Verifica la conexión con el servidor",
        icon: "error",
      });
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb pageName="Crear Perfil de Usuario" />
      
      <div className="mb-6 p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📋 Información del Usuario
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
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          ✏️ Datos del Perfil
        </h3>
        <AppForm
          mode={1}
          labels={labels as string[]}
          info={null}
          handleAction={handleCreate}
          validationSchema={validationSchema}
        />
      </div>
    </div>
  );
};

export default CreateProfile;