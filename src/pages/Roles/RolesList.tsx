import React, { useState } from "react";
import { Role } from "../../models/Roles";

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Admin" },
    { id: 2, name: "User" },
  ]);

  const handleAction = (action: string, item: Role) => {
    if (action === "assignPermissions") {
      console.log("Assign permissions to role:", item);
    }
  };

  return (
    <div>
      <h2>Role List</h2>
    </div>
  );
};

export default RolesList;
