import React, { useState, useEffect } from "react";
import {User} from '../../models/User'
import { userService } from "../../services/userService";
import Swal from "sweetalert2";

const ListUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); //Variable reactiva

    useEffect(() => { //Cuando la pagina se carga obtiene los datos
        fetchData();
    },[]);

    // 🔹 Obtiene los datos de los usuarios
    const fetchData = async () => {
        const users = await userService.getUsers(); //LLamamos al metodo el service.
        setUsers(users);  //Asignamos la informacion a nuestra variable reactiva
    };

  const handleAction = async(action: string, item: User) => {
    if (action === "edit") {
    } else if (action === "delete") {
      const succes = await userService.deleteUser(item.id!)
      if (succes){
        Swal.fire({
          title: 'Eliminado',
          text: 'Usuario Eliminado',
          icon: 'success'
        })
        fetchData();
      }
    }
  };

  return (
    <div>
      <h2>User List</h2>
    </div>
  );
};

export default ListUsers;
