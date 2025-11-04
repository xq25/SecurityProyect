import React, { useEffect, useState } from "react";
import { AppFormSelect } from "../../components/ui/FormSelectGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Device } from "../../models/Device";
import { User } from "../../models/User";

const CreateDevice: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersData = await userService.getUsers();
    setUsers(usersData);
  };

  const deviceValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(
        /^[A-Za-z0-9\s-_]+$/,
        "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos"
      ),

    ip: Yup.string()
      .required("La dirección IP es obligatoria")
      .min(2, "Ingrese al menos 2 caracteres")
      .max(50, "La IP no puede tener más de 50 caracteres"),

    operating_system: Yup.string()
      .required("El sistema operativo es obligatorio")
      .min(3, "El sistema operativo debe tener al menos 3 caracteres")
      .max(50, "El sistema operativo no puede tener más de 50 caracteres"),
  });

  const handleCreateDevice = async (device: Device) => {
    if (selectedUserId === 0) {
      Swal.fire({
        title: "Error",
        text: "Debe seleccionar un usuario",
        icon: "error",
        timer: 3000,
      });
      return;
    }

    try {
      const deviceWithUser = {
        ...device,
        user_id: selectedUserId,
      };

      const createdDevice = await deviceService.createDevice(deviceWithUser);

      if (createdDevice) {
        Swal.fire({
          title: "Completado",
          text: "Se ha creado correctamente el dispositivo",
          icon: "success",
          timer: 3000,
        });
        navigate("/devices/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "Existe un problema al momento de crear el dispositivo",
          icon: "error",
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Existe un problema al momento de crear el dispositivo",
        icon: "error",
        timer: 3000,
      });
    }
  };

  return (
    <div>
      <h2>Crear Dispositivo</h2>
      <Breadcrumb pageName="Devices / Crear Dispositivo" />

      {/* UN SOLO COMPONENTE: Formulario con Select integrado */}
      <AppFormSelect
        mode={1}
        labels={["name", "ip", "operating_system"]}
        handleAction={handleCreateDevice}
        validationSchema={deviceValidationSchema}
        selectLabel="Usuario Propietario"
        selectOptions={users}
        selectValue={selectedUserId}
        onSelectChange={(value) => setSelectedUserId(value as number)}
        selectDisplayKey="name"
        selectValueKey="id"
        selectPlaceholder="Seleccionar usuario..."
        selectRequired={true}
      />
    </div>
  );
};

export default CreateDevice;