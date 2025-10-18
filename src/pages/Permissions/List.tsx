import React, { useState, useEffect } from "react";
import {User} from '../../models/User'
import { userService } from "../../services/userService";
import Swal from "sweetalert2";
import { AppTable } from '../../components/ui/TableGeneric';

const Permissions: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]); //Variable reactiva
    const header = ['id', 'name', 'email'];
    const filteredUsers = users.map(user => {
        const filtered: Record<string, any> = {};
            header.forEach(key => {
                if (key in user) filtered[key] = user[key];
        });
        return filtered;
    });

    useEffect(() => { //Cuando la pagina se carga obtiene los datos de todos los usuarioss.
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
  
  if (users){
    return (
      <div>
        <h2>Permissions List</h2>
        <AppTable name={'Usuarios'} header={header} items={[]} />
      </div>
    );
  }
  else{
    return (
      <div>
        <h2> Error al Cargar Usuarios</h2>
      </div>
    );
  }
};


export default Permissions;