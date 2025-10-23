import React, { useState, useEffect } from "react";
import { User } from "../../models/User";
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { useNavigate } from "react-router-dom";

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Variable reactiva con la lista de usuarios
  const navigate = useNavigate();

  // 🔹 Al cargar el componente, obtenemos los usuarios desde el backend
  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Método que obtiene los usuarios desde el servicio
  const fetchData = async () => {
    const users = await userService.getUsers();
    setUsers(users); // Asignamos la data obtenida a la variable reactiva
  };

  // 🔹 Define las acciones que pueden realizarse sobre cada usuario
  const handleAction = async (action: string, user: User) => {
    if (action === "delete") {
      const success = await userService.deleteUser(user.id!);
      if (success) {
        Swal.fire({
          title: "Eliminado",
          text: "Usuario eliminado correctamente",
          icon: "success",
        });
        fetchData(); // Refresca la tabla después de eliminar
      }
    } else if (action === "view") {
      navigate('/users/create')
    } else if (action === "update") {
      navigate(`/users/update/${user.id}`);
    }
  };

  // 🔹 Configuración base de botones (se aplicará dinámicamente a cada fila)
  const baseOptions = [
    { name: "view", action: () => {} },
    { name: "update", action: () => {} },
    { name: "delete", action: () => {} },
    {name: 'profile', action: () => {} },
    {name: 'address', action: () => {} },
    {name: 'devices', action: () => {} },
    {name: 'passwords', action: () => {} },
    {name: 'sessions', action: () => {} }
  ];

  // 🔹 Render principal de la pagina.
  return (
    <div>
      <h2>Listado de Usuarios</h2>
      <AppTable
        name="Usuarios"
        header={["id", "name", "email"]}
        items={users}
        // Generamos los botones a partir de las opciones
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            // Pasamos la acción con el usuario que corresponde
            action={(user) => handleAction(opt.name, user)}
          />
        ))}
      />
    </div>
  );
};

export default ListUsers;
