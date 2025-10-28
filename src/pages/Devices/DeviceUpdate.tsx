import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppFormSelect } from "../../components/ui/FormSelectGeneric";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import Breadcrumb from "../../components/Breadcrumb";
import { Device } from "../../models/Device";
import { User } from "../../models/User";

const UpdateDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [device, setDevice] = useState<Device | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const [deviceData, usersData] = await Promise.all([
      deviceService.getDeviceById(parseInt(id)),
      userService.getUsers(),
    ]);

    if (deviceData) {
      setDevice(deviceData);
      setSelectedUserId(deviceData.userId || 0);
    }

    setUsers(usersData);
    setLoading(false);
  };

  const deviceValidationSchema = Yup.object({
    name: Yup.string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(50, "El nombre no puede tener más de 50 caracteres"),

    ip: Yup.string()
      .required("La dirección IP es obligatoria")
      .min(2, "Ingrese al menos 2 caracteres")
      .max(50, "La IP no puede tener más de 50 caracteres"),

    operating_system: Yup.string()
      .required("El sistema operativo es obligatorio")
      .min(3, "El sistema operativo debe tener al menos 3 caracteres"),
  });

  const handleUpdateDevice = async (updatedDevice: Device) => {
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
        ...updatedDevice,
        userId: selectedUserId,
      };

      const updated = await deviceService.updateDevice(parseInt(id!), deviceWithUser);

      if (updated) {
        Swal.fire({
          title: "Completado",
          text: "Se ha actualizado correctamente el dispositivo",
          icon: "success",
          timer: 3000,
        });
        navigate("/devices/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el dispositivo",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar el dispositivo",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!device) {
    return <div>Dispositivo no encontrado</div>;
  }

  return (
    <div>
      <h2>Actualizar Dispositivo</h2>
      <Breadcrumb pageName="Devices / Actualizar Dispositivo" />

      {/* ✅ Formulario con Select integrado en modo UPDATE */}
      <AppFormSelect
        mode={2}
        labels={["name", "ip", "operating_system"]}
        info={device}
        handleAction={handleUpdateDevice}
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

export default UpdateDevice;