import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import { profileService } from "../../services/profileService";
import Breadcrumb from "../../components/Breadcrumb";
import { AppView } from "../../components/ui/ViewInfoGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ViewUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const user = await userService.getUserById(Number(id));

    if (id) {
      const profile = await profileService.getProfileByUser(Number(id));
      setHasProfile(!!profile);

      if (user && profile) {
        const combinedData = {
          ...user,
          phone: profile.phone || "Sin teléfono",
          photo: profile.photo || "Sin foto",
        };
        setUser(combinedData as any);
      } else {
        setUser(user);
      }
    } else {
      setUser(user);
    }
  };

  const handleAction = async (action: string) => {
    if (action === "delete") {
      const success = await userService.deleteUser(Number(id));
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Usuario eliminado correctamente",
          icon: "success",
        });
        navigate("/users/list");
      }
    } else if (action === "update") {
      navigate(`/users/update/${id}`);
    } else if (action === "profile") {
      if (hasProfile) {
        navigate(`/users/${id}/profile/update`);
      } else {
        navigate(`/users/${id}/profile/create`);
      }
    }
    // ← REMOVIDO: el caso de "sessions" ya no está aquí
  };

  // ← CAMBIO: Eliminamos "sessions" de las opciones
  const baseOptions = [
    { name: "update" },
    { name: "delete" },
    { name: hasProfile ? "edit_profile" : "create_profile" },
    // ← REMOVIDO: { name: "sessions" }
  ];

  return (
    <div>
      <Breadcrumb pageName="Información de Usuario" />
      {user ? (
        <AppView
          title={"Información de Usuario"}
          info={user}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={() =>
                handleAction(
                  opt.name.includes("profile") ? "profile" : opt.name
                )
              }
            />
          ))}
          toggleableFields={["password"]}
        />
      ) : (
        <div className="p-6">Cargando usuario...</div>
      )}
    </div>
  );
};

export default ViewUser;