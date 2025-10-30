import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Breadcrumb from "../../components/Breadcrumb";
import { AppForm } from "../../components/ui/FormGeneric";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { profileService } from "../../services/profileService";
import { Profile } from "../../models/Profile";

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // userId
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      const data = await profileService.getProfileByUser(Number(id));
      setProfile(data);
    };
    fetchProfile();
  }, [id]);

  const validationSchema = Yup.object({
    phone: Yup.string().required("El teléfono es obligatorio"),
    photo: Yup.string().url("Debe ser una URL válida").nullable(),
  });

  const labels: (keyof Profile)[] = ["phone", "photo"];

  const handleUpdate = async (values: Profile) => {
    if (!profile?.id) return;
    
    const updated = await profileService.updateProfile(profile.id, values);
    
    if (updated) {
      Swal.fire({
        title: "Perfil actualizado exitosamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/users/view/${id}`);
    } else {
      Swal.fire({
        title: "Error al actualizar el perfil",
        icon: "error",
        timer: 2500,
      });
    }
  };

  if (!profile) {
    return <div className="p-6">Cargando perfil...</div>;
  }

  return (
    <div>
      <Breadcrumb pageName="Editar Perfil de Usuario" />
      <AppForm
        mode={3}
        labels={labels as string[]}
        info={profile}
        handleAction={handleUpdate}
        validationSchema={validationSchema}
      />
    </div>
  );
};

export default UpdateProfile;