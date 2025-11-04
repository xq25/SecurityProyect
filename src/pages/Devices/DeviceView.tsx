import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deviceService } from "../../services/deviceService";
import { userService } from "../../services/userService";
import { Device } from "../../models/Device";
import { User } from "../../models/User";
import Breadcrumb from "../../components/Breadcrumb";

const ViewDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const deviceData = await deviceService.getDeviceById(parseInt(id));
    setDevice(deviceData);

    if (deviceData?.user_id) {
      const userData = await userService.getUserById(deviceData.user_id);
      setUser(userData);
    }

    setLoading(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!device) {
    return <div>Dispositivo no encontrado</div>;
  }

  return (
    <div>
      <h2>Detalles del Dispositivo</h2>
      <Breadcrumb pageName="Devices / Ver Dispositivo" />

      <div className="card">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>ID:</strong>
              <p>{device.id}</p>
            </div>
            <div className="col-md-6">
              <strong>Nombre:</strong>
              <p>{device.name}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Dirección IP:</strong>
              <p>{device.ip}</p>
            </div>
            <div className="col-md-6">
              <strong>Sistema Operativo:</strong>
              <p>{device.operating_system}</p>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <strong>Usuario Propietario:</strong>
              <p>{user ? `${user.name} (${user.email})` : `ID: ${device.user_id}`}</p>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/devices/update/${device.id}`)}
            >
              Editar
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/devices/list")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDevice;