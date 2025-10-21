import React, { useState } from "react";
import { Roles } from "../../models/Roles";
import {AppTable} from '../../components/ui/TableGeneric';
import {AppButton} from '../../components/ui/ButtonGeneric'

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Roles[]>([
    { id: 1, name: "Admin" },
    { id: 2, name: "User" },
  ]);

  const handleAction = (action: string, item: Roles) => {
    if (action === "assignPermissions") {
      console.log("Assign permissions to role:", item);
    }
  };

  const header = [];
  header.push(Object.keys(roles[0]));
  return (
    <div>
      <h2>Role List</h2>
      <AppTable name={'Roles'} header={['ID', 'Name', 'Actions']} items={[{ contentRow: ["valor1", "valor2", [<AppButton name="update" action={()=>console.log('actualice')}/>, <AppButton name="delete" action={()=>console.log('borre')}/> ]] },
  { contentRow: ["valorA", "valorB",] }]}/>
    </div>
  );
};

export default RolesList;
