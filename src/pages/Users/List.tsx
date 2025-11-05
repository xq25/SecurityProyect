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
      // ← view mantiene su funcionalidad original
      navigate(`/users/view/${user.id}`);
    } else if (action === "update") {
      navigate(`/users/update/${user.id}`);
    } else if (action === "profile") {
      // ← CAMBIO: profile ahora también navega a la vista completa
      navigate(`/users/view/${user.id}`);
    } else if (action === "sessions") {
      // ← CAMBIO: sessions navega a lista de sesiones del usuario
      navigate(`/sessions/user/${user.id}`);
    } else if (action === "devices") {
      navigate(`/devices/list?userId=${user.id}`);
    } else if (action === "digital-signatures") {
      navigate(`/digital-signatures/list?userId=${user.id}`);
    } else if (action === 'passwords'){
      navigate(`/passwords/user/${user.id}`);
    } else if (action === 'address'){
      navigate(`/addresses/user/${user.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },           // ← Se mantiene
    { name: "update" },
    { name: "delete" },
    { name: 'profile' },        // ← Ahora también va a /users/view/:id
    { name: 'address' },
    { name: 'digital-signatures'},
    { name: 'devices' },
    { name: 'passwords' },
    { name: 'sessions' }        // ← Navega a /sessions/user/:id
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