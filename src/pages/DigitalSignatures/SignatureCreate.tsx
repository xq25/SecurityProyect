import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const CreateDigitalSignature: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const usersData = await userService.getUsers();
    setUsers(usersData);
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserId === 0) {
      Swal.fire("Error", "Debe seleccionar un usuario", "error");
      return;
    }

    if (!photoFile) {
      Swal.fire("Error", "Debe seleccionar una foto", "error");
      return;
    }

    const formData = new FormData();
    formData.append("userId", selectedUserId.toString());
    formData.append("photo", photoFile);

    try {
      const created = await digitalSignatureService.createDigitalSignature(formData);

      if (created) {
        Swal.fire({
          title: "Completado",
          text: "Firma digital creada correctamente",
          icon: "success",
          timer: 3000,
        });
        navigate("/digital-signatures/list");
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo crear la firma digital",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al crear la firma digital",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <h2>Crear Firma Digital</h2>
      <Breadcrumb pageName="Digital Signatures / Crear" />

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <select
                className="form-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                required
              >
                <option value="0">Seleccionar usuario...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <AppFileInput
              label="Foto de Firma Digital"
              accept="image/*"
              onChange={handleFileChange}
              value={photoFile}
              preview={photoPreview}
            />

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">
                Crear
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/digital-signatures/list")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDigitalSignature;