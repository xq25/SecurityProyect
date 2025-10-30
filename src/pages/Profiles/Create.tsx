import React from "react";
import * as Yup from "yup";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { profileService } from "../../services/profileService";
import { Profile } from "../../models/Profile";

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // userId

  const validationSchema = Yup.object({
    phone: Yup.string().required("El teléfono es obligatorio"),
    photo: Yup.string().url("Debe ser una URL válida").nullable(),
  });

  const labels: (keyof Profile)[] = ["phone", "photo"];

  const handleCreate = async (values: Profile) => {
    if (!id) return;
    
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
        icon: "error",
        timer: 2500,
      });
    }
  };

  return (
    <div>
      <Breadcrumb pageName="Crear Perfil de Usuario" />
      <AppForm
        mode={1}
        labels={labels as string[]}
        info={null}
        handleAction={handleCreate}
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default CreateProfile;