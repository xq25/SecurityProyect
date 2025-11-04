import React, { useEffect, useState } from "react";
// Importacion de Componentes
import Breadcrumb from "../../components/Breadcrumb";
import { AppView } from "../../components/ui/ViewInfoGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import Swal from "sweetalert2";
// Importacion de Hooks
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//  Importaciones relacionadas con la clase User
import { User } from "../../models/User";
import { userService } from "../../services/userService";




const ViewUser: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  
  const {id} = useParams<{id:string}>();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const user = await userService.getUserById(Number(id));
    setUser(user);
  };

  const handleAction = async (action: string, id: number) => {
    if (action === "delete") {
        const success = await userService.deleteUser(id);
        if (success) {
            Swal.fire({
                title: "Eliminado",
                text: "Usuario eliminado correctamente",
                icon: "success",
            });
          navigate('/users/list')
        }
    } else if (action === "update") {
        navigate(`/users/update/${id}`);
    }
  };
  const baseOptions = [
    { name: 'update' },
    { name: 'delete' },
  ]

  return (
    <div>
      <h2>View User</h2>
      <Breadcrumb pageName="Users / View User" />
      {user ? (
        <AppView
          title={'Visualizacion Informacion Completa Del Usuario'}
          info={user}
          options={baseOptions.map((opt) => (
            <AppButton
              key={opt.name}
              name={opt.name}
              action={()=> handleAction(opt.name, Number(id))}
            />
          ))}
          toggleableFields={['password']}
        />
      ) : (
        <div>Cargando usuario...</div>
      )}
    </div>
  );
};

export default ViewUser;
