import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { digitalSignatureService } from "../../services/digitalSignatureService";
import { userService } from "../../services/userService";
import { DigitalSignature } from "../../models/DigitalSignature";
import { User } from "../../models/User";
import { AppFileInput } from "../../components/ui/FileInputGeneric";
import Breadcrumb from "../../components/Breadcrumb";
import Swal from "sweetalert2";

const UpdateDigitalSignature: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [signature, setSignature] = useState<DigitalSignature | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    const signatureData = await digitalSignatureService.getDigitalSignatureById(parseInt(id));
    setSignature(signatureData);

    if (signatureData?.userId) {
      const userData = await userService.getUserById(signatureData.userId);
      setUser(userData);
    }

    if (signatureData?.photo) {
      setPhotoPreview(signatureData.photo);
    }

    setLoading(false);
  };

  const handleFileChange = (file: File | null) => {
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoFile) {
      Swal.fire("Error", "Debe seleccionar una nueva foto", "error");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photoFile);

    try {
      const updated = await digitalSignatureService.updateDigitalSignature(parseInt(id!), formData);

      if (updated) {
        Swal.fire({
          title: "Completado",
          text: "Firma digital actualizada correctamente",
          icon: "success",
          timer: 3000,
        });
        navigate(`/digital-signatures/list`);
      } else {
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar la firma digital",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar la firma digital",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!signature) {
    return <div>Firma digital no encontrada</div>;
  }

  return (
    <div>
      <h2>FBC - Signature</h2>
      <Breadcrumb pageName="Digital Signatures / Actualizar" />

      <div className="card">
        <div className="card-body">
          {/* Información del usuario */}
          {user && (
            <div className="mb-4">
              <h5>Name: FBC</h5>
              <p className="text-muted">Email: {user.email}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AppFileInput
              label="Photo:"
              accept="image/*"
              onChange={handleFileChange}
              value={photoFile}
              preview={photoPreview}
            />

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary w-100">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDigitalSignature;