import React, { useState, useEffect } from "react";
import { Device } from "../../models/Device";
import { deviceService } from "../../services/deviceService";
import Swal from "sweetalert2";
import { AppTable } from "../../components/ui/TableGeneric";
import { AppButton } from "../../components/ui/ButtonGeneric";
import { AppActionButton } from "../../components/ui/ActionButtonGeneric";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const ListDevices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");

  useEffect(() => {
    fetchData();
  }, [userIdParam]);

  const fetchData = async () => {
    if (userIdParam) {
      const devicesData = await deviceService.getDevicesByUserId(parseInt(userIdParam));
      setDevices(devicesData);
    } else {
      const devicesData = await deviceService.getDevices();
      setDevices(devicesData);
    }
  };

  const handleAction = async (action: string, device: Device) => {
    if (action === "delete") {
      const result = await Swal.fire({
        title: "¿Está seguro?",
        text: `¿Desea eliminar el dispositivo "${device.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const success = await deviceService.deleteDevice(device.id!);
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Dispositivo eliminado correctamente",
            icon: "success",
          });
          fetchData();
        }
      }
    } else if (action === "view") {
      navigate(`/devices/${device.id}`);
    } else if (action === "update") {
      navigate(`/devices/update/${device.id}`);
    }
  };

  const baseOptions = [
    { name: "view" },
    { name: "update" },
    { name: "delete" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Listado de Dispositivos</h2>
        {/* ✅ Botón reutilizable */}
        <AppActionButton
          text="Crear Nuevo Dispositivo"
          onClick={() => navigate("/devices/create")}
          icon={<FaPlus />}
          variant="success"
        />
      </div>

      <AppTable
        name="Dispositivos"
        header={["id", "name", "ip", "operating_system", "userId"]}
        items={devices}
        options={baseOptions.map((opt) => (
          <AppButton
            key={opt.name}
            name={opt.name}
            action={(device) => handleAction(opt.name, device)}
          />
        ))}
      />
    </div>
  );
};

export default ListDevices;