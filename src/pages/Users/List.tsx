import React, { useState, useEffect} from "react";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate } from "react-router-dom";

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const users = await userService.getUsers();
    setUsers(users);
  };

  const handleAction = async (action: string, user: User) => {
    if (action === "delete") {
      const success = await userService.deleteUser(user.id!);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Usuario eliminado correctamente",
          icon: "success",
        });
        fetchData();
      }
    } else if (action === "view") {
      navigate('/users/create');
    } else if (action === "update") {
      navigate(`/users/update/${user.id}`);
    } else if (action === "devices") {
      // Redirigir a la lista de dispositivos
      navigate(`/devices/list?userId=${user.id}`);
    } else if (action === "digital-signatures") {
      // Redirigir a la gestión de firma digital
      navigate(`/digital-signatures/list?userId=${user.id}`);
    }else if (action === 'passwords'){
      navigate(`/passwords/user/${user.id}`);
    }else if (action === 'address'){
      navigate(`/addresses/user/${user.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
    { name: 'profile' },
    { name: 'address' },
    { name: 'digital-signatures'},
    { name: 'devices' },
    { name: 'passwords' },
    { name: 'sessions' }
  ];

  return (
    <div>
      <h2>Listado de Usuarios</h2>
      <AppButton name={'create'} action={()=> {
        navigate('/users/create');
      }}/>
      <AppTable
        name="Usuarios"
        header={["id", "name", "email"]}
        items={users}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(user) => handleAction(opt.name, user)}
          />
        ))}
      />
    </div>
  );
};

export default ListUsers;