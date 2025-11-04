import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { AppView } from "../../components/ui/ViewInfoGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import { profileService } from "../../services/profileService";

const ViewUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const userData = await userService.getUserById(Number(id));

    if (id) {
      const profile = await profileService.getProfileByUser(Number(id));
      setHasProfile(!!profile);

      if (userData && profile) {
        const combinedData = {
          ...userData,
          phone: profile.phone || "Sin teléfono",
          photo: profile.photo || "Sin foto",
        };
        setUser(combinedData as any);
      } else {
        setUser(userData);
      }
    } else {
      setUser(userData);
    }
  };

  const handleAction = async (action: string, userId: number) => {
    if (action === "delete") {
      const success = await userService.deleteUser(userId);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Usuario eliminado correctamente",
          icon: "success",
        });
        navigate("/users/list");
      }
    } else if (action === "update") {
      navigate(`/users/update/${userId}`);
    } else if (action === "profile") {
      if (hasProfile) {
        navigate(`/users/${userId}/profile/update`);
      } else {
        navigate(`/users/${userId}/profile/create`);
      }
    } else if (action === "sessions") {
      navigate(`/users/${userId}/sessions`);
    }
  };

  const baseOptions = [
    { name: "update" },
    { name: "delete" },
    { name: hasProfile ? "edit_profile" : "create_profile" },
    { name: "sessions" },
  ];

  return (
    <div>
      <Breadcrumb pageName="Users / View User" />
      {user ? (
        <AppView
          title={"Visualizacion Informacion Completa Del Usuario"}
          info={user}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={() =>
                handleAction(
                  opt.name.includes("profile") ? "profile" : opt.name,
                  Number(id)
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